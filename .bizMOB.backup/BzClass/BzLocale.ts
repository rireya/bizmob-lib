import Network from '../Xross/Network';
import Localization from '../Xross/Localization';
import { getBizMOBI18n } from '../i18n';

export default class BzLocale {
  public static async initLocale() {
    const res = await Localization.getLocale();

    if (res.locale !== '') {
      // Universal i18n을 사용하여 언어 변경
      const i18n = await getBizMOBI18n();
      await i18n.changeLocale(res.locale.substring(0, 2));
      Network.changeLocale({ _sLocaleCd: res.locale });
    }
  }

  public static async getLocale() {
    return Localization.getLocale();
  }

  public static changeLocale(newLocaleCd: string) {
    Network.changeLocale({ _sLocaleCd: newLocaleCd });
    Localization.setLocale({ _sLocaleCd: newLocaleCd });
  }
}
