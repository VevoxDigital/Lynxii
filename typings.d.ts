// core typings

/** A mapping of project names to their overridden keys */
declare interface PackageProjectEntryKeyOverride {
  [index: string]: any
}

declare interface PackageProjectEntry {
  /** The extensions the license should be appended to */
  licenseExtensions: Array<string>

  /** The package keys that should be forwarded to the sub-project packages */
  forwardedPackageKeys: Array<string>

  /** Overridden package keys for sub-projects */
  overridePackageKeys: PackageProjectEntryKeyOverride
}

// package file
declare module '*/package.json' {
  /** The name of the package */
  export const name: string

  /** The version of the package */
  export const version: string

  /** The package's author */
  export const author: string

  /** The package's license */
  export const license: string

  /** Project information for this package */
  export const project: PackageProjectEntry
}
