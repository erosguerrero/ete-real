import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

export default (() => {
  function Properties({ fileData, displayClass }: QuartzComponentProps) {
    if (!fileData.frontmatter || Object.keys(fileData.frontmatter).length === 0) {
      return null
    }

    const properties = Object.entries(fileData.frontmatter).filter(
      ([key, value]) => key !== "title" && key !== "tags" && key !== "aliases" && value != null && value !== "" && (!Array.isArray(value) || value.length > 0)
    )

    if (properties.length === 0) {
      return null
    }

    return (
      <div class={classNames(displayClass, "properties-container")} style={{ 
        border: "1px solid var(--light)", 
        borderRadius: "5px", 
        padding: "1rem", 
        marginBottom: "1.5rem",
        backgroundColor: "var(--lightgray)" 
      }}>
        <h4 style={{ marginTop: 0, fontSize: "1rem", color: "var(--darkgray)", marginBottom: "0.5rem" }}>Propiedades</h4>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {properties.map(([key, value]) => {
            const displayValue = Array.isArray(value) ? value.join(", ") : String(value)
            return (
              <li key={key} style={{ marginBottom: "0.25rem", fontSize: "0.9rem" }}>
                <strong style={{ color: "var(--dark)" }}>{key}:</strong> {displayValue}
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  return Properties
}) satisfies QuartzComponentConstructor
