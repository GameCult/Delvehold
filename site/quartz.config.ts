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
        header: { name: "Montserrat", weights: [100, 200, 300, 400, 600] },
        title: { name: "Montserrat", weights: [100, 200, 300, 400, 600] },
        body: { name: "Ubuntu", weights: [300, 400, 500, 700], includeItalic: true },
        code: "IBM Plex Mono",
      },
      colors: {
        lightMode: {
          light: "#050505",
          lightgray: "#202020",
          gray: "#8f8f8f",
          darkgray: "#f4f4f4",
          dark: "#ffffff",
          secondary: "#2f9663",
          tertiary: "#2f9663",
          highlight: "rgba(47, 150, 99, 0.15)",
          textHighlight: "#2f966355",
        },
        darkMode: {
          light: "#050505",
          lightgray: "#202020",
          gray: "#8f8f8f",
          darkgray: "#f4f4f4",
          dark: "#ffffff",
          secondary: "#2f9663",
          tertiary: "#2f9663",
          highlight: "rgba(47, 150, 99, 0.15)",
          textHighlight: "#2f966355",
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
