import { siteSettingsReplaceInputSchema } from "@/cms/schema/site-settings";
import type { SiteSettingsReplaceInput } from "@/cms/types/dto";
import type { DeploymentSiteKey } from "@/cms/types/site";
import type {
  SiteContactDetails,
  SiteFooterData,
  SiteSeoBlock,
  SiteSocialLink,
  SiteSwitchBarLink,
} from "@/cms/types/settings";

export function emptyContact(): SiteContactDetails {
  return {
    businessName: null,
    email: null,
    phone: null,
    addressLines: [],
    headline: null,
  };
}

export function emptySeoBlock(): SiteSeoBlock {
  return {
    defaultTitle: null,
    defaultMetaDescription: null,
    titleSuffix: null,
    ogType: "website",
  };
}

export function createDefaultSiteSettings(): SiteSettingsReplaceInput {
  return siteSettingsReplaceInputSchema.parse({
    contactBySite: {},
    footer: { copyrightHtml: null, legalLinks: [], columns: [] },
    seoBySite: {},
    socialLinks: [],
    switchBarLinks: [],
  });
}

/** Full form model with both deployment sites materialized (easier field bindings). */
export function mergeSiteSettingsForForm(loaded: SiteSettingsReplaceInput | null): SiteSettingsReplaceInput {
  const base = createDefaultSiteSettings();
  if (!loaded) {
    return siteSettingsReplaceInputSchema.parse({
      ...base,
      contactBySite: {
        abexis: emptyContact(),
        search: emptyContact(),
      },
      seoBySite: {
        abexis: emptySeoBlock(),
        search: emptySeoBlock(),
      },
    });
  }

  const footer: SiteFooterData = {
    copyrightHtml: loaded.footer?.copyrightHtml ?? null,
    legalLinks: [...(loaded.footer?.legalLinks ?? [])],
    columns: [...(loaded.footer?.columns ?? [])],
  };

  const contactBySite: SiteSettingsReplaceInput["contactBySite"] = {
    abexis: { ...emptyContact(), ...loaded.contactBySite?.abexis },
    search: { ...emptyContact(), ...loaded.contactBySite?.search },
  };

  const seoBySite: SiteSettingsReplaceInput["seoBySite"] = {
    abexis: { ...emptySeoBlock(), ...loaded.seoBySite?.abexis },
    search: { ...emptySeoBlock(), ...loaded.seoBySite?.search },
  };

  const socialLinks: SiteSocialLink[] = [...(loaded.socialLinks ?? [])];
  const switchBarLinks: SiteSwitchBarLink[] = [...(loaded.switchBarLinks ?? [])];

  return siteSettingsReplaceInputSchema.parse({
    contactBySite,
    footer,
    defaultSeo: loaded.defaultSeo,
    seoBySite,
    socialLinks,
    switchBarLinks,
  });
}

export function deploymentSiteLabel(site: DeploymentSiteKey): string {
  return site === "abexis" ? "abexis.ch" : "Executive Search";
}
