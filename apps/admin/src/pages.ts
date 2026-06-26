/**
 * apps/admin — Surface administrativa.
 * Consume `@analytics` para dashboards y `@core-kernel` para readiness.
 *
 * Este módulo expone las entradas lazy‑loaded de la surface administrativa
 * y del dashboard principal, con tipado explícito para mejorar DX y evitar
 * errores silenciosos en los imports dinámicos.
 */

import { lazy, type ComponentType } from "react";

/**
 * Lazy factory tipada para componentes React.
 * Evita repetir la anotación de tipo y facilita la refactorización.
 */
function lazyComponent<T extends ComponentType<any>>(loader: () => Promise<{ default: T }>): T {
  // React.lazy maneja la promesa y devuelve un componente que React entiende.[web:39]
  return lazy(loader) as unknown as T;
}

/**
 * AdminDashboard — Surface administrativa principal.
 *
 * - Debe exportar un default component desde "@/pages/admin/Dashboard".
 * - Pensada para usarse dentro de una <Suspense> con fallback adecuado.
 */
export const AdminDashboard = lazyComponent(
  () => import("@/pages/admin/Dashboard")
);

/**
 * Dashboard — Surface general de usuario.
 *
 * - Debe exportar un default component desde "@/pages/Dashboard".
 * - Ideal para integrar con un router (React Router / TanStack Router)
 *   usando route‑level code splitting.[web:33][web:35]
 */
export const Dashboard = lazyComponent(
  () => import("@/pages/Dashboard")
);
