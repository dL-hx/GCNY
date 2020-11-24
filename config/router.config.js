export default [
  // login
  {
    path: '/login',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/login', redirect: '/login/login' },
      { path: '/login/login', name: 'login', component: './Login/Login' },
      {
        component: '404',
      },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      // dashboard
      { path: '/', redirect: '/dashboard/analysis' },
      {
        path: '/dashboard/analysis',
        icon: 'dashboard',
        name: 'dashboard',
        component: './Dashboard',
      },

      // {
      //   path: '/',
      //   redirect: '/info/news_info'
      // },

      // router redirect Component
      // {
      //   path: '/',
      //   component: './News/RedirectPage',
      // },


      // 信息资讯
      {
        name: 'info',
        icon: 'appstore',
        path: '/info',
        routes: [
          {
            path: '/info',
            component: './Info',
          },
          {
            path: '/info/details',
            component: './Info/details',
          },
        ],
      },

      // 文章管理
      {
        name: 'article',
        icon: 'edit',
        path: '/article',
        routes: [
          {
            path: '/article',
            component: './Article',
          },
        ],
      },

      // 供求管理
      {
        name: 'sellAndBuy',
        icon: 'tag',
        path: '/SellAndBuy',
        routes: [
          {
            path: '/SellAndBuy/sell',
            name: 'sell',
            icon: 'icon-guanli1',
            component: './SellAndBuy/Sell.js',
          },
          {
            path: '/SellAndBuy/sell/details',
            component: './SellAndBuy/sellBuy/details',
            hideInMenu: true,
          },
          {
            path: '/SellAndBuy/buy',
            name: 'buy',
            icon: 'icon-guanli',
            component: './SellAndBuy/Buy.js',
          },
          {
            path: '/SellAndBuy/buy/details',
            component: './SellAndBuy/sellBuy/details',
            hideInMenu: true,
          },
          {
            component: '404',
          },
        ],
      },

      // 问答管理
      {
        name: 'q_a',
        icon: 'question',
        path: '/q_a',
        routes: [
          {
            path: '/q_a',
            component: './Q&A',
          },
          {
            path: '/q_a/details',
            component: './Q&A/details',
          },
        ],
      },


      // 专家管理
      {
        name: 'expert',
        icon: 'icon-tianchongxing-',
        path: '/expert',
        routes: [
          {
            path: '/expert',
            // name: 'user',
            component: './Expert',
          },
          {
            path: '/expert/details',
            // name: 'details',
            component: './Expert/details',
            hideInMenu: true,
          },
        ],
      },

      // 账户管理
      {
        name: 'account',
        icon: 'user',
        path: '/account',
        routes: [
          {
            path: '/account',
            // name: 'user',
            component: './Account',
          },
          {
            path: '/account/details',
            // name: 'details',
            component: './Account/details',
            hideInMenu: true,
          },
        ],
      },

      // 用户管理
      {
        name: 'user',
        icon: 'icon-guanli2',
        path: '/user',
        routes: [
          {
            path: '/user',
            // name: 'user',
            // icon: 'fund',
            component: './Users',
          },
        ],
      },

      {
        component: '404',
      },
    ],
  },
];
