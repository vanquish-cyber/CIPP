import React, { Suspense } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { PrivateRoute, FullScreenLoading, ErrorBoundary } from 'src/components/utilities'
import 'src/scss/style.scss'
import { Helmet } from 'react-helmet-async'
import Skeleton from 'react-loading-skeleton'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
TimeAgo.addDefaultLocale(en)
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import routes from 'src/routes'
import { useAuthCheck } from './components/utilities/CippauthCheck'

library.add(fas)
const dynamicImport = (path) => React.lazy(() => import(`./${path}.jsx`))
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))
const Page401 = React.lazy(() => import('./views/pages/page401/Page401'))
const Page403 = React.lazy(() => import('./views/pages/page403/Page403'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))
const PageLogOut = React.lazy(() => import('src/views/pages/LogoutRedirect/PageLogOut'))
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Logout = React.lazy(() => import('./views/pages/login/Logout'))
const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<FullScreenLoading />}>
        <Helmet>
          <title>CIPP</title>
        </Helmet>
        <Routes>
          <Route exact path="/LogoutRedirect" name="LogoutRedirect" element={<PageLogOut />} />
          <Route exact path="/401" name="Page 401" element={<Page401 />} />
          <Route exact path="/403" name="Page 403" element={<Page403 />} />
          <Route exact path="/404" name="Page 404" element={<Page404 />} />
          <Route exact path="/500" name="Page 500" element={<Page500 />} />
          <Route exact path="/login" name="Login" element={<Login />} />
          <Route exact path="/logout" name="Logout" element={<Logout />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <DefaultLayout />
              </PrivateRoute>
            }
          >
            {routes.map((route, idx) => {
              const Component = dynamicImport(route.component)
              const allowedRoles = route.allowedRoles
              return (
                Component && (
                  <Route
                    key={`route-${idx}`}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    element={
                      <PrivateRoute allowedRoles={allowedRoles}>
                        <Suspense fallback={<Skeleton />}>
                          <Helmet>
                            <title>CIPP - {route.name}</title>
                          </Helmet>
                          <ErrorBoundary key={route.name}>
                            <Component />
                          </ErrorBoundary>
                        </Suspense>
                      </PrivateRoute>
                    }
                  />
                )
              )
            })}
            <Route path="/" element={<Navigate to="/home" replace={true} />} />
          </Route>
          <Route path="*" name="Page 404" element={<Page404 />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
