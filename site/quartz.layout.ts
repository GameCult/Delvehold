import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import DelveholdMasthead from "./quartz/components/DelveholdMasthead"

export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [DelveholdMasthead(), Component.Spacer(), Component.Search()],
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
      component: Component.Breadcrumbs({ rootName: "DELVE/HOLD" }),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ConditionalRender({
      component: Component.ArticleTitle(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ConditionalRender({
      component: Component.ContentMeta(),
      condition: (page) => page.fileData.slug !== "index",
    }),
  ],
  left: [
    Component.ConditionalRender({
      component: Component.DesktopOnly(Component.Explorer()),
      condition: (page) => page.fileData.slug !== "index",
    }),
  ],
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
  beforeBody: [Component.Breadcrumbs({ rootName: "DELVE/HOLD" }), Component.ArticleTitle(), Component.ContentMeta()],
  left: [Component.DesktopOnly(Component.Explorer())],
  right: [],
}
