/** Typed CMS boundary errors (optional use in services / API). */
export class CmsConfigurationError extends Error {
  readonly code = "CMS_NOT_CONFIGURED";
  constructor(message = "Firebase Admin or Web SDK is not configured.") {
    super(message);
    this.name = "CmsConfigurationError";
  }
}

export class CmsQueryError extends Error {
  readonly code = "CMS_QUERY_FAILED";
  constructor(message = "Firestore query failed.", cause?: unknown) {
    super(message, { cause });
    this.name = "CmsQueryError";
  }
}
