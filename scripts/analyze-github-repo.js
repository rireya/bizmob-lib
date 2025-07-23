// scripts/analyze-github-repo.js
const fs = require('fs');
const path = require('path');
const glob = require('glob');

class GitHubRepoAnalyzer {
  constructor(repoPath) {
    // Windows 경로 정규화
    this.repoPath = path.resolve(repoPath);
    this.results = {
      jsFiles: [],
      tsFiles: [],
      jsonFiles: [],
      mdFiles: [],
      structure: {}
    };
  }

  /**
   * 전체 레포 구조 분석
   */
  async analyzeRepository() {
    console.log(`=== ${this.repoPath} 레포 구조 분석 시작 ===`);

    // 1. 각 파일 타입별 분석
    this.analyzeJavaScriptFiles();
    this.analyzeTypeScriptFiles();
    this.analyzeJSONFiles();
    this.analyzeMarkdownFiles();

    // 2. 구조 요약
    this.generateStructureSummary();

    // 3. 결과 저장
    this.saveAnalysisResults();

    return this.results;
  }

  /**
   * JavaScript 파일 분석
   */
  analyzeJavaScriptFiles() {
    console.log('\n🟨 JavaScript 파일 분석...');

    const jsPatterns = [
      'public/bizMOB/**/*.js',
      'public/**/*.js',
      'src/**/*.js'
    ];

    // 제외할 폴더 패턴
    const ignorePatterns = [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.git/**',
      '**/coverage/**'
    ];

    jsPatterns.forEach(pattern => {
      console.log(`  🔍 패턴 검색: ${pattern}`);

      const files = glob.sync(pattern, {
        cwd: this.repoPath,
        ignore: ignorePatterns
      });
      console.log(`     → ${files.length}개 파일 발견`);

      files.forEach(file => {
        const fullPath = path.join(this.repoPath, file);
        const fileInfo = this.analyzeJSFile(fullPath, file);
        if (fileInfo) {
          this.results.jsFiles.push(fileInfo);
          console.log(`  ✅ ${file}`);
        }
      });
    });

    console.log(`📊 총 ${this.results.jsFiles.length}개 JS 파일 발견`);
  }

  /**
   * TypeScript 파일 분석
   */
  analyzeTypeScriptFiles() {
    console.log('\n🟦 TypeScript 파일 분석...');

    const tsPatterns = [
      'src/bizMOB/Xross/**/*.ts',
      'src/bizMOB/BzClass/**/*.ts',
      'src/bizMOB/i18n/**/*.ts',
      'src/**/*.ts'
    ];

    // 제외할 폴더 패턴
    const ignorePatterns = [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.git/**',
      '**/coverage/**'
    ];

    tsPatterns.forEach(pattern => {
      console.log(`  🔍 패턴 검색: ${pattern}`);

      const files = glob.sync(pattern, {
        cwd: this.repoPath,
        ignore: ignorePatterns
      });
      console.log(`     → ${files.length}개 파일 발견`);

      files.forEach(file => {
        const fullPath = path.join(this.repoPath, file);
        const fileInfo = this.analyzeTSFile(fullPath, file);
        if (fileInfo) {
          this.results.tsFiles.push(fileInfo);
          console.log(`  ✅ ${file}`);
        }
      });
    });

    console.log(`📊 총 ${this.results.tsFiles.length}개 TS 파일 발견`);
  }

  /**
   * JSON 파일 분석
   */
  analyzeJSONFiles() {
    console.log('\n🟩 JSON 파일 분석...');

    const jsonPatterns = [
      'public/mock/**/*.json',
      'src/**/*.json',
      'config/**/*.json',
      '*.json'  // 루트의 package.json 등만
    ];

    // 제외할 폴더 패턴
    const ignorePatterns = [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.git/**',
      '**/coverage/**'
    ];

    jsonPatterns.forEach(pattern => {
      console.log(`  🔍 패턴 검색: ${pattern}`);

      const files = glob.sync(pattern, {
        cwd: this.repoPath,
        ignore: ignorePatterns
      });
      console.log(`     → ${files.length}개 파일 발견`);

      files.forEach(file => {
        const fullPath = path.join(this.repoPath, file);
        const fileInfo = this.analyzeJSONFile(fullPath, file);
        if (fileInfo) {
          this.results.jsonFiles.push(fileInfo);
          console.log(`  ✅ ${file}`);
        }
      });
    });

    console.log(`📊 총 ${this.results.jsonFiles.length}개 JSON 파일 발견`);
  }

  /**
   * Markdown 파일 분석
   */
  analyzeMarkdownFiles() {
    console.log('\n📝 Markdown 파일 분석...');

    const mdPatterns = [
      '*.md',              // 루트의 README.md 등
      'docs/**/*.md',
      'src/**/*.md',
      'public/**/*.md'
    ];

    // 제외할 폴더 패턴
    const ignorePatterns = [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.git/**',
      '**/coverage/**'
    ];

    mdPatterns.forEach(pattern => {
      console.log(`  🔍 패턴 검색: ${pattern}`);

      const files = glob.sync(pattern, {
        cwd: this.repoPath,
        ignore: ignorePatterns
      });
      console.log(`     → ${files.length}개 파일 발견`);

      files.forEach(file => {
        const fullPath = path.join(this.repoPath, file);
        const fileInfo = this.analyzeMDFile(fullPath, file);
        if (fileInfo) {
          this.results.mdFiles.push(fileInfo);
          console.log(`  ✅ ${file}`);
        }
      });
    });

    console.log(`📊 총 ${this.results.mdFiles.length}개 MD 파일 발견`);
  }

  /**
   * JavaScript 파일 상세 분석
   */
  analyzeJSFile(filePath, relativePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const stats = fs.statSync(filePath);

      return {
        path: relativePath,
        absolutePath: filePath,
        size: stats.size,
        lastModified: stats.mtime,
        category: this.categorizeJSFile(relativePath),
        targetPath: this.getTargetPath(relativePath, 'js'),
        hasJSDoc: this.hasJSDocComments(content),
        functions: this.extractFunctionNames(content),
        classes: this.extractClassNames(content),
        exports: this.extractExports(content)
      };
    } catch (error) {
      console.error(`❌ JS 파일 분석 실패: ${relativePath}`, error.message);
      return null;
    }
  }

  /**
   * TypeScript 파일 상세 분석
   */
  analyzeTSFile(filePath, relativePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const stats = fs.statSync(filePath);

      return {
        path: relativePath,
        absolutePath: filePath,
        size: stats.size,
        lastModified: stats.mtime,
        category: this.categorizeTSFile(relativePath),
        targetPath: this.getTargetPath(relativePath, 'ts'),
        hasJSDoc: this.hasJSDocComments(content),
        interfaces: this.extractInterfaces(content),
        types: this.extractTypes(content),
        classes: this.extractClassNames(content),
        exports: this.extractExports(content)
      };
    } catch (error) {
      console.error(`❌ TS 파일 분석 실패: ${relativePath}`, error.message);
      return null;
    }
  }

  /**
   * JSON 파일 상세 분석
   */
  analyzeJSONFile(filePath, relativePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const stats = fs.statSync(filePath);
      const jsonData = JSON.parse(content);

      return {
        path: relativePath,
        absolutePath: filePath,
        size: stats.size,
        lastModified: stats.mtime,
        category: this.categorizeJSONFile(relativePath),
        targetPath: this.getTargetPath(relativePath, 'json'),
        keys: Object.keys(jsonData),
        structure: this.analyzeJSONStructure(jsonData),
        isMockData: relativePath.includes('mock')
      };
    } catch (error) {
      console.error(`❌ JSON 파일 분석 실패: ${relativePath}`, error.message);
      return null;
    }
  }

  /**
   * Markdown 파일 상세 분석
   */
  analyzeMDFile(filePath, relativePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const stats = fs.statSync(filePath);

      return {
        path: relativePath,
        absolutePath: filePath,
        size: stats.size,
        lastModified: stats.mtime,
        category: this.categorizeMDFile(relativePath),
        targetPath: this.getTargetPath(relativePath, 'md'),
        headings: this.extractMarkdownHeadings(content),
        codeBlocks: this.extractCodeBlocks(content),
        links: this.extractLinks(content)
      };
    } catch (error) {
      console.error(`❌ MD 파일 분석 실패: ${relativePath}`, error.message);
      return null;
    }
  }

  /**
   * 파일 카테고리 분류
   */
  categorizeJSFile(filePath) {
    // 외부 라이브러리 먼저 체크
    if (filePath.includes('extlib\\') || filePath.includes('extlib/')) return 'externals';

    // JavaScript 번들 파일들
    if (filePath.includes('bizMOB-core')) return 'bundles';
    if (filePath.includes('bizMOB-xross4')) return 'bundles';
    if (filePath.includes('bizMOB-polyfill')) return 'bundles';
    if (filePath.includes('bizMOB-locale')) return 'bundles';

    return 'bundles'; // 기본값
  }

  categorizeTSFile(filePath) {
    if (filePath.includes('Xross')) return 'core';
    if (filePath.includes('BzClass')) return 'classes';
    if (filePath.includes('i18n')) return 'i18n';
    if (filePath.includes('bizmob.d.ts')) return 'types';
    return 'types';
  }

  categorizeJSONFile(filePath) {
    if (filePath.includes('mock')) {
      // Mock 데이터를 기능별로 분류 (정확한 경로 매칭)
      if (filePath.includes('mock\\bizMOB\\App\\') || filePath.includes('mock/bizMOB/App/')) return 'samples/app';
      if (filePath.includes('mock\\bizMOB\\Database\\') || filePath.includes('mock/bizMOB/Database/')) return 'samples/database';
      if (filePath.includes('mock\\bizMOB\\File\\') || filePath.includes('mock/bizMOB/File/')) return 'samples/file';
      if (filePath.includes('mock\\bizMOB\\Push\\') || filePath.includes('mock/bizMOB/Push/')) return 'samples/push';
      if (filePath.includes('mock\\bizMOB\\System\\') || filePath.includes('mock/bizMOB/System/')) return 'samples/system';
      if (filePath.includes('mock\\bizMOB\\Window\\') || filePath.includes('mock/bizMOB/Window/')) return 'samples/window';
      if (filePath.includes('mock\\bizMOB\\Contacts\\') || filePath.includes('mock/bizMOB/Contacts/')) return 'samples/contacts';
      if (filePath.includes('mock\\DM') || filePath.includes('mock/DM')) return 'samples/legacy';
      return 'samples/misc';
    }
    // 설정 파일들
    if (filePath.includes('package.json') || filePath.includes('tsconfig.json')) {
      return 'config';
    }
    return 'config';
  }

  categorizeMDFile(filePath) {
    if (filePath.includes('README')) return 'root';
    if (filePath.includes('api')) return 'api-docs';
    if (filePath.includes('example')) return 'examples';
    if (filePath.includes('guide')) return 'guides';
    return 'misc';
  }

  /**
   * 정형화된 구조의 타겟 경로 생성
   */
  getTargetPath(originalPath, fileType) {
    const category = this[`categorize${fileType.toUpperCase()}File`](originalPath);
    const fileName = path.basename(originalPath);

    switch (fileType) {
      case 'js':
        return `libs/javascript/${category}/${fileName}`;
      case 'ts':
        return `libs/typescript/${category}/${fileName}`;
      case 'json':
        if (category.startsWith('samples/')) {
          return `libs/${category}/${fileName}`;
        }
        return `libs/${category}/${fileName}`;
      case 'md':
        return `docs/${category}/${fileName}`;
      default:
        return `misc/${fileName}`;
    }
  }

  /**
   * JSDoc 주석 존재 여부 확인
   */
  hasJSDocComments(content) {
    return /\/\*\*[\s\S]*?\*\//.test(content);
  }

  /**
   * 함수명 추출
   */
  extractFunctionNames(content) {
    const functionRegex = /function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
    const arrowFunctionRegex = /const\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*\(/g;
    const methodRegex = /([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g;

    const functions = [];
    let match;

    while ((match = functionRegex.exec(content)) !== null) {
      functions.push(match[1]);
    }

    while ((match = arrowFunctionRegex.exec(content)) !== null) {
      functions.push(match[1]);
    }

    return [...new Set(functions)];
  }

  /**
   * 클래스명 추출
   */
  extractClassNames(content) {
    const classRegex = /class\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
    const classes = [];
    let match;

    while ((match = classRegex.exec(content)) !== null) {
      classes.push(match[1]);
    }

    return classes;
  }

  /**
   * 인터페이스 추출
   */
  extractInterfaces(content) {
    const interfaceRegex = /interface\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
    const interfaces = [];
    let match;

    while ((match = interfaceRegex.exec(content)) !== null) {
      interfaces.push(match[1]);
    }

    return interfaces;
  }

  /**
   * 타입 정의 추출
   */
  extractTypes(content) {
    const typeRegex = /type\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
    const types = [];
    let match;

    while ((match = typeRegex.exec(content)) !== null) {
      types.push(match[1]);
    }

    return types;
  }

  /**
   * 익스포트 추출
   */
  extractExports(content) {
    const exportRegex = /export\s+(?:default\s+)?(?:class|function|const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
    const exports = [];
    let match;

    while ((match = exportRegex.exec(content)) !== null) {
      exports.push(match[1]);
    }

    return exports;
  }

  /**
   * JSON 구조 분석
   */
  analyzeJSONStructure(jsonData) {
    const getType = (value) => {
      if (Array.isArray(value)) return 'array';
      if (value === null) return 'null';
      return typeof value;
    };

    const analyzeObject = (obj, depth = 0) => {
      if (depth > 3) return { type: 'deep_object' }; // 깊이 제한

      const structure = {};
      for (const [key, value] of Object.entries(obj)) {
        const type = getType(value);
        if (type === 'object') {
          structure[key] = analyzeObject(value, depth + 1);
        } else {
          structure[key] = { type };
        }
      }
      return structure;
    };

    return analyzeObject(jsonData);
  }

  /**
   * 마크다운 헤딩 추출
   */
  extractMarkdownHeadings(content) {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const headings = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      headings.push({
        level: match[1].length,
        text: match[2].trim()
      });
    }

    return headings;
  }

  /**
   * 코드 블록 추출
   */
  extractCodeBlocks(content) {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const codeBlocks = [];
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      codeBlocks.push({
        language: match[1] || 'text',
        code: match[2].trim()
      });
    }

    return codeBlocks;
  }

  /**
   * 링크 추출
   */
  extractLinks(content) {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const links = [];
    let match;

    while ((match = linkRegex.exec(content)) !== null) {
      links.push({
        text: match[1],
        url: match[2]
      });
    }

    return links;
  }

  /**
   * 구조 요약 생성
   */
  generateStructureSummary() {
    this.results.structure = {
      summary: {
        totalFiles: this.results.jsFiles.length + this.results.tsFiles.length +
          this.results.jsonFiles.length + this.results.mdFiles.length,
        jsFiles: this.results.jsFiles.length,
        tsFiles: this.results.tsFiles.length,
        jsonFiles: this.results.jsonFiles.length,
        mdFiles: this.results.mdFiles.length
      },
      categories: this.generateCategorySummary(),
      migrationPlan: this.generateMigrationPlan()
    };
  }

  /**
   * 카테고리별 요약
   */
  generateCategorySummary() {
    const categories = {};

    [...this.results.jsFiles, ...this.results.tsFiles].forEach(file => {
      const category = file.category;
      if (!categories[category]) {
        categories[category] = { js: 0, ts: 0, files: [] };
      }
      categories[category][file.path.endsWith('.js') ? 'js' : 'ts']++;
      categories[category].files.push(file.path);
    });

    return categories;
  }

  /**
   * 마이그레이션 계획 생성
   */
  generateMigrationPlan() {
    const plan = {
      jsFiles: this.results.jsFiles.map(file => ({
        from: file.path,
        to: file.targetPath,
        category: file.category
      })),
      tsFiles: this.results.tsFiles.map(file => ({
        from: file.path,
        to: file.targetPath,
        category: file.category
      })),
      jsonFiles: this.results.jsonFiles.map(file => ({
        from: file.path,
        to: file.targetPath,
        category: file.category
      }))
    };

    return plan;
  }

  /**
   * 분석 결과 저장
   */
  saveAnalysisResults() {
    const outputDir = 'analysis-results';
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 전체 결과 저장
    fs.writeFileSync(
      path.join(outputDir, 'full-analysis.json'),
      JSON.stringify(this.results, null, 2)
    );

    // 마이그레이션 계획만 별도 저장
    fs.writeFileSync(
      path.join(outputDir, 'migration-plan.json'),
      JSON.stringify(this.results.structure.migrationPlan, null, 2)
    );

    // 요약 리포트 저장
    this.generateMarkdownReport(outputDir);

    console.log(`\n📁 분석 결과가 ${outputDir} 폴더에 저장되었습니다.`);
  }

  /**
   * 마크다운 리포트 생성
   */
  generateMarkdownReport(outputDir) {
    const { structure } = this.results;

    const report = `# bizMOB 라이브러리 구조 분석 리포트

## 📊 전체 요약
- **총 파일 수**: ${structure.summary.totalFiles}개
- **JavaScript 파일**: ${structure.summary.jsFiles}개
- **TypeScript 파일**: ${structure.summary.tsFiles}개
- **JSON 파일**: ${structure.summary.jsonFiles}개
- **Markdown 파일**: ${structure.summary.mdFiles}개

## 📁 카테고리별 분류
${Object.entries(structure.categories).map(([category, info]) =>
      `### ${category}\n- JS: ${info.js}개, TS: ${info.ts}개\n- 파일: ${info.files.join(', ')}\n`
    ).join('\n')}

## 🔄 마이그레이션 계획

### JavaScript 파일 이전
${structure.migrationPlan.jsFiles.map(file =>
      `- \`${file.from}\` → \`${file.to}\``
    ).join('\n')}

### TypeScript 파일 이전
${structure.migrationPlan.tsFiles.map(file =>
      `- \`${file.from}\` → \`${file.to}\``
    ).join('\n')}

### JSON 파일 이전
${structure.migrationPlan.jsonFiles.map(file =>
      `- \`${file.from}\` → \`${file.to}\``
    ).join('\n')}

---
*생성 일시: ${new Date().toISOString()}*
`;

    fs.writeFileSync(path.join(outputDir, 'analysis-report.md'), report);
  }
}

// 사용 예시
async function main() {
  let repoPath = process.argv[2];

  // 인자가 없으면 여러 위치에서 bizmob-lib 폴더 찾기
  if (!repoPath) {
    const possiblePaths = [
      path.resolve(__dirname, '..'),           // ../
      path.resolve(__dirname, '../..'),        // ../../
      path.resolve(__dirname, '../bizmob-lib'), // ../bizmob-lib
      path.resolve(__dirname, '../../bizmob-lib'), // ../../bizmob-lib
      './bizmob-lib',
      '../bizmob-lib',
      '.'
    ];

    console.log('🔍 bizmob-lib 폴더를 찾는 중...');

    for (const testPath of possiblePaths) {
      console.log(`  테스트 중: ${testPath}`);
      if (fs.existsSync(testPath)) {
        const publicPath = path.join(testPath, 'public');
        const srcPath = path.join(testPath, 'src');

        if (fs.existsSync(publicPath) || fs.existsSync(srcPath)) {
          repoPath = testPath;
          console.log(`  ✅ 발견: ${testPath}`);
          break;
        }
      }
    }

    if (!repoPath) {
      console.error('❌ bizmob-lib 폴더를 찾을 수 없습니다.');
      console.log('\n💡 다음 중 하나를 시도해보세요:');
      console.log('1. node scripts/analyze-github-repo.js /full/path/to/bizmob-lib');
      console.log('2. bizmob-lib 폴더로 이동 후 실행');
      console.log('3. 현재 위치에서 ls -la 로 폴더 구조 확인');
      return;
    }
  }

  console.log(`🔍 분석 대상 경로: ${repoPath}`);

  if (!fs.existsSync(repoPath)) {
    console.error(`❌ 레포 경로가 존재하지 않습니다: ${repoPath}`);
    return;
  }

  // 주요 폴더 존재 여부 확인
  const publicPath = path.join(repoPath, 'public');
  const srcPath = path.join(repoPath, 'src');

  console.log(`📁 public 폴더 존재: ${fs.existsSync(publicPath) ? '✅' : '❌'}`);
  console.log(`📁 src 폴더 존재: ${fs.existsSync(srcPath) ? '✅' : '❌'}`);

  if (!fs.existsSync(publicPath) && !fs.existsSync(srcPath)) {
    console.error('❌ public 또는 src 폴더를 찾을 수 없습니다.');
    console.log('\n📂 현재 경로의 내용:');
    try {
      const contents = fs.readdirSync(repoPath);
      contents.forEach(item => {
        const itemPath = path.join(repoPath, item);
        const isDir = fs.statSync(itemPath).isDirectory();
        console.log(`  ${isDir ? '📁' : '📄'} ${item}`);
      });
    } catch (error) {
      console.log('  폴더 내용을 읽을 수 없습니다.');
    }
    return;
  }

  const analyzer = new GitHubRepoAnalyzer(repoPath);
  const results = await analyzer.analyzeRepository();

  console.log('\n✅ 분석 완료!');
  console.log(`📊 총 ${results.structure.summary.totalFiles}개 파일 분석`);
  console.log(`📁 analysis-results/ 폴더에서 상세 결과 확인`);
}

// 스크립트 직접 실행 시
if (require.main === module) {
  main().catch(console.error);
}

module.exports = GitHubRepoAnalyzer;