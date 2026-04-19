import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { resolveRelative, slugifyFilePath, simplifySlug, FilePath } from "../util/path"

export default (() => {
  function Properties({ fileData, displayClass }: QuartzComponentProps) {
    if (!fileData.frontmatter || Object.keys(fileData.frontmatter).length === 0) {
      return null
    }

    const properties = Object.entries(fileData.frontmatter).filter(
      ([key, value]) => key !== "title" && key !== "tags" && key !== "aliases" && key !== "base" && value != null && value !== "" && (!Array.isArray(value) || value.length > 0)
    )

    if (properties.length === 0) {
      return null
    }

    const renderValue = (value: any): any => {
      // Si la propiedad es una lista (array)
      if (Array.isArray(value)) {
        return (
          <ul style={{ margin: 0, paddingLeft: "1.2rem", marginTop: "0.2rem" }}>
            {value.map((v, i) => (
              <li key={i} style={{ marginBottom: "0.2rem" }}>{renderValue(v)}</li>
            ))}
          </ul>
        )
      }
      
      const strVal = String(value)
      // Buscamos enlaces de Obsidian [[...]]
      const match = strVal.match(/^\[\[(.*?)\]\]$/)
      if (match) {
        let linkPath = match[1]
        let alias = linkPath
        
        // Soportar enlaces con alias como [[Ruta/Archivo|Nombre]]
        if (linkPath.includes("|")) {
          const parts = linkPath.split("|")
          linkPath = parts[0]
          alias = parts[1]
        } else {
          // Si no hay alias, mostrar solo el nombre del archivo sin extensión
          alias = linkPath.split("/").pop()?.replace(/\.md$/, "") || linkPath
        }

        const targetSlug = simplifySlug(slugifyFilePath(linkPath as FilePath))
        const href = resolveRelative(fileData.slug!, targetSlug)
        
        return <a href={href} class="internal">{alias}</a>
      }
      
      return strVal
    }

    return (
      <div class={classNames(displayClass, "properties-container")} style={{ 
        border: "1px solid var(--lightgray)", 
        borderRadius: "12px", 
        padding: "1.5rem", 
        marginBottom: "2rem",
        backgroundColor: "var(--light)",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.03)"
      }}>
        <h4 style={{ 
          marginTop: 0, 
          fontSize: "1.2rem", 
          color: "var(--dark)", 
          marginBottom: "1.2rem",
          paddingBottom: "0.6rem",
          borderBottom: "1px solid var(--lightgray)",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          fontWeight: 600
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--tertiary)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          Información
        </h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1.2rem" }}>
          {properties.map(([key, value]) => {
            const displayKey = key
            return (
              <div key={key} style={{ 
                background: "var(--lightgray)",
                padding: "1rem",
                borderRadius: "8px",
                border: "1px solid rgba(0,0,0,0.02)"
              }}>
                <span style={{ 
                  display: "block",
                  color: "var(--gray)", 
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "0.4rem",
                  fontWeight: 700
                }}>{displayKey}</span>
                <span style={{ 
                  color: "var(--dark)",
                  fontSize: "0.95rem",
                  display: "block",
                  lineHeight: "1.5"
                }}>
                  {renderValue(value)}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return Properties
}) satisfies QuartzComponentConstructor
