import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

const config: QuartzConfig = {
  configuration: {
    pageTitle: "DELVE/HOLD",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: null,
    locale: "en-GB",
    baseUrl: "delvehold.gamecult.org",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: { name: "Montserrat", weights: [300, 400, 600, 700] },
        title: { name: "Montserrat", weights: [300, 400, 600, 700] },
        body: { name: "Ubuntu", weights: [300, 400, 500, 700], includeItalic: true },
        code: "IBM Plex Mono",
      },
      colors: {
        lightMode: {
          light: "#f4eedf",
          lightgray: "#ded3ba",
          gray: "#857963",
          darkgray: "#42392d",
          dark: "#211b16",
          secondary: "#9b4f2f",
          tertiary: "#52705a",
          highlight: "rgba(155, 79, 47, 0.14)",
          textHighlight: "#d8a04b66",
        },
        darkMode: {
          light: "#17130f",
          lightgray: "#282117",
          gray: "#877b65",
          darkgray: "#d0c3a7",
          dark: "#f3ead8",
          secondary: "#e09555",
          tertiary: "#8fbd91",
          highlight: "rgba(224, 149, 85, 0.14)",
          textHighlight: "#d8a04b55",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({ priority: ["frontmatter", "git", "filesystem"] }),
      Plugin.SyntaxHighlighting({
        theme: { light: "github-light", dark: "github-dark" },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.ContentIndex({ enableSiteMap: true, enableRSS: true }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      Plugin.CustomOgImages(),
    ],
  },
}

export default config
