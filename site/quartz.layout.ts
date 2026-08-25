import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [Component.PageTitle(), Component.Spacer(), Component.Search(), Component.Darkmode()],
  afterBody: [],
  footer: Component.Footer({
    links: {
      GameCult: "https://gamecult.org",
      GitHub: "https://github.com/GameCult/Delvehold",
    },
  }),
}

export const defaultContentPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs({ rootName: "DELVE/HOLD" }), Component.ArticleTitle(), Component.ContentMeta()],
  left: [Component.DesktopOnly(Component.Explorer())],
  right: [Component.DesktopOnly(Component.TableOfContents()), Component.Backlinks()],
}

export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs({ rootName: "DELVE/HOLD" }), Component.ArticleTitle(), Component.ContentMeta()],
  left: [Component.DesktopOnly(Component.Explorer())],
  right: [],
}

