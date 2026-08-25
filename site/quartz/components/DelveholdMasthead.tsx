import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { FullSlug, resolveRelative } from "../util/path"

const routes = [
  { label: "Documentation", slug: "Documentation/index" as FullSlug, prefix: "Documentation" },
  { label: "Game Design", slug: "Game-Design/index" as FullSlug, prefix: "Game-Design" },
  { label: "Lore", slug: "Lore/index" as FullSlug, prefix: "Lore" },
]

function isActive(currentSlug: string, prefix: string) {
  return currentSlug === prefix || currentSlug.startsWith(`${prefix}/`)
}

export default (() => {
  const DelveholdMasthead: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
    const currentSlug = fileData.slug ?? ("index" as FullSlug)

    return (
      <section class="delvehold-masthead">
        <a class="delvehold-wordmark" href={resolveRelative(currentSlug, "index" as FullSlug)}>
          <span class="delvehold-wordmark-delve">DELVE</span>
          <span class="delvehold-wordmark-slash">/</span>
          <span class="delvehold-wordmark-hold">HOLD</span>
        </a>
        <nav class="delvehold-nav" aria-label="DELVE/HOLD sections">
          {routes.map((route) => {
            const active = isActive(currentSlug, route.prefix)
            return (
              <a
                href={resolveRelative(currentSlug, route.slug)}
                class={active ? "active" : undefined}
                aria-current={active ? "page" : undefined}
              >
                {route.label}
              </a>
            )
          })}
        </nav>
      </section>
    )
  }

  return DelveholdMasthead
}) satisfies QuartzComponentConstructor
