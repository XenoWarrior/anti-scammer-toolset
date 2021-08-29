import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from "../../components/pages/Home.vue";
import JobCreate from "../../components/pages/JobCreate.vue";
import JobList from "../../components/pages/JobList.vue";
import DataGenerator from "../../components/refactor/DataGenerator.vue";

Vue.use(VueRouter);

export default new VueRouter({
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/jobs',
            name: 'job-list',
            component: JobList

        },
        {
            path: '/job/create',
            name: 'job-create',
            component: JobCreate
        },
        {
            path: '/legacy/data-generator',
            name: 'data-generator',
            component: DataGenerator
        }
        // {
        //     path: '/job/view/:id',
        //     name: 'view-job',
        //     component: Login
        // },
        // {
        //     path: '/logout',
        //     name: 'logout',
        //     component: Logout
        // },
        // {
        //     path: '/register',
        //     name: 'register',
        //     component: Register
        // },
        // {
        //     path: '/stats',
        //     name: 'statistics',
        //     component: Statistics
        // },
        // {
        //     path: '/dashboard',
        //     name: 'dashboard',
        //     component: Dashboard
        // },
        // {
        //     path: '/dashboard/view/:file',
        //     name: 'view-file',
        //     component: File
        // }
    ]
});