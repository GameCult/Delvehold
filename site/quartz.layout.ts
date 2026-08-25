import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import DelveholdMasthead from "./quartz/components/DelveholdMasthead"

const documentationExplorer = Component.ConditionalRender({
  component: Component.DesktopOnly(
    Component.Explorer({
      title: "Documentation",
      folderDefaultState: "open",
      folderClickBehavior: "link",
      useSavedState: false,
      filterFn: (node) => node.slug.startsWith("Documentation"),
    }),
  ),
  condition: (page) =>
    page.fileData.slug === "Documentation" || page.fileData.slug?.startsWith("Documentation/"),
})

const gameDesignExplorer = Component.ConditionalRender({
  component: Component.DesktopOnly(
    Component.Explorer({
      title: "Game Design",
      folderDefaultState: "open",
      folderClickBehavior: "link",
      useSavedState: false,
      filterFn: (node) => node.slug.startsWith("Game-Design"),
    }),
  ),
  condition: (page) =>
    page.fileData.slug === "Game-Design" || page.fileData.slug?.startsWith("Game-Design/"),
})

const loreExplorer = Component.ConditionalRender({
  component: Component.DesktopOnly(
    Component.Explorer({
      title: "Lore",
      folderDefaultState: "open",
      folderClickBehavior: "link",
      useSavedState: false,
      filterFn: (node) => node.slug.startsWith("Lore"),
    }),
  ),
  condition: (page) => page.fileData.slug === "Lore" || page.fileData.slug?.startsWith("Lore/"),
})

const sectionExplorers = [documentationExplorer, gameDesignExplorer, loreExplorer]

export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [DelveholdMasthead()],
  afterBody: [],
  footer: Component.Footer({
    links: {
      GameCult: "https://gamecult.org",
      GitHub: "https://github.com/GameCult/Delvehold",
    },
  }),
}

export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.ArticleTitle(),
      condition: (page) => page.fileData.slug !== "index",
    }),
  ],
  left: sectionExplorers,
  right: [
    Component.ConditionalRender({
      component: Component.DesktopOnly(Component.TableOfContents()),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ConditionalRender({
      component: Component.Backlinks(),
      condition: (page) => page.fileData.slug !== "index",
    }),
  ],
}

export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.ArticleTitle()],
  left: sectionExplorers,
  right: [],
}
