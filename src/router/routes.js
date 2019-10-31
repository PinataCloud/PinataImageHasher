
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IpfsInfo.vue') },
      { path: 'LogBook', component: () => import('pages/LogBook.vue') },
      { path: 'FileCheck', component: () => import('pages/FileCheck.vue') },
      { path: 'CIDsList', component: () => import('pages/CIDsList.vue') }

    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
