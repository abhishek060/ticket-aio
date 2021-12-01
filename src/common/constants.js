// const electron = window.require('electron');
// const electron = require('electron');
// const userDataPath = (electron.app || electron.remote.app).getPath('userData');

module.exports = {

    // BASE_URL: "http://localhost:3007/api/",
    BASE_URL: "https://ticket-aio-api.herokuapp.com/api/",

    APP_ID: "351700145564620",
    LOCAL_STORAGE: {
        LOGIN_INFO: "logged-user-obj",
        LOGIN_STATUS: "logged-status",
        GOOGLE_COOKIES: "gCookies",
        CAPTCHA_HARVESTERS: "captchaHarvester"
    },

    API_ENDPOINTS: {
        RECORD_CAPTCHA: "record_captcha_tokens",
        ADD_BULK_PROFILE:"/add-bulk-profiles",
        USER: "users",
        ORDERS: "orders",
        PROFILE: "profiles", 
        CAPTCHA_DATA: "captcha_data",
        PROXIES: "proxies",
        COUNTRY: "countries",
        TEST_DISCORD: "/test-discord",
        ADD_ORDER: "/add-order",
        RUN_PROXY: "proxycheck",
        TASK: "task",
        START_TASK: "/start-task",
        STOP_TASK: "/stop-task",
        DELETE_TASK: "delete-task",
        DELETE_PROFILE: "delete-profile",
        DELETE_PROXY: "delete-proxy",
        SITE: "site",
        LOGIN: "/login-user",
        USER_ORDERS: "/user-orders",
        UPDATE_ORDERS: "/update-order",
        USER_DATA: "/user-data",
        UPDATE_SETTINGS: "/update-settings",
        USER_PROFILES: "/user-profiles",
        USER_PROXIES: "/user-proxies",
        GET_STATES: "/get-states",
        ADD_PROFILE: "/add-profile",
        UPDATE_PROFILE: "/update-profile",
        ADD_BULK_PROXY: "/add-bulk-proxy",
        DELETE_USER_ORDER: "/delete-user-orders",
        DELETE_USER_PROFILES: "/delete-user-profiles",
        DELETE_USER_PROXIES: "/delete-user-proxies",
        DELETE_USER_ORDER_SINGLE: "/delete-order",
        DELETE_USER_PROXY_SINGLE: "/delete-proxy",
        DELETE_USER_PROFILE_SINGLE: "/delete-profile",
        START_ALL_TASKS: "/start-all-tasks",
        STOP_ALL_TASKS: "/stop-all-tasks",
        TEST_PROXY: "/test-proxy",
        DASHBOARD_DATA: "/dashboard-data",
        USER_CAPTCHA: "/user-captcha",
    }

};
