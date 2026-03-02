import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '@/Pages/core/PageLogin.vue';
import Profile from '@/Pages/Profile.vue';
import Report from '@/Pages/ReportOee.vue';
import Complains from '@/Pages/Complains.vue';
import ManPowerStd from '@/Pages/ManPowerStd.vue';
import ProblemReason from '@/Pages/ProblemReason.vue';
import UploadSpeed from '@/Pages/UploadSpeed.vue';
import LineProcessOrder from '@/Pages/LineProcessOrder.vue'
const routes = [
   {
    path: '/Report',
    name: 'Report',
    component: Report,
    meta: {
      breadcrumb: [{ name: 'Report', link: '/Report' },
      ],
    },
  },
      {
    path: '/LineProcessOrder',
    name: 'LineProcessOrder',
    component: LineProcessOrder,
    meta: {
      breadcrumb: [{ name: 'Line Process Order', link: '/LineProcessOrder' },
      ],
    },
  },
   {
    path: '/UploadSpeed',
    name: 'UploadSpeed',
    component: UploadSpeed,
    meta: {
      breadcrumb: [{ name: 'Upload Speed', link: '/UploadSpeed' },
      ],
    },
  },
      {
    path: '/ProblemReason',
    name: 'ProblemReason',
    component: ProblemReason,
    meta: {
      breadcrumb: [{ name: 'Problem & Reason', link: '/ProblemReason' },
      ],
    },
  },
    {
    path: '/Complains',
    name: 'Complains',
    component: Complains,
    meta: {
      breadcrumb: [{ name: 'Complains', link: '/Complains' },
      ],
    },
  },
  {
    path: '/ManPowerStd',
    name: 'ManPowerStd',
    component: ManPowerStd,
    meta: {
      breadcrumb: [{ name: 'Man Power Standard', link: '/ManPowerStd' },
      ],
    },
  },
  
  {
    path: '/',
    name: 'Login',
    component: Login,
    meta: {
      allowAnonymous: true,
    },
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  // 👉 หน้า anonymous ผ่านได้เลย
  if (to.meta.allowAnonymous) {
    return next()
  }

  // 👉 หน้า protected ต้องมี token
  const accessToken = localStorage.getItem('accessTokenIpvOee')
  if (!accessToken) {
    return next({ name: 'Login' })
  }

  next()
})

export default router;
