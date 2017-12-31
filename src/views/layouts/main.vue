<template>
    <div id="app">
        <mt-header fixed :title="getTitle()" id="header">
            <router-link v-if="isTopPath()" to="/" slot="left">
                <mt-button icon="back">返回</mt-button>
            </router-link>
            <!--<mt-button slot="left" @click="handleClose">关闭</mt-button>
            <mt-button icon="more" slot="right"></mt-button>-->
            <router-link v-if="isLogin()" to="/logout" slot="right">
                <mt-button>退出</mt-button>
            </router-link>
        </mt-header>
        <!--<sidebar></sidebar>-->
        <!--<img src="~@img/logo.png" />-->
        <div id="main">
            <router-view></router-view>
            <!--<transition :name="transitionName">
            <router-view class="child-view"></router-view>
            </transition>-->
        </div>
    </div>
</template>
<script src="@js/layouts/main.js"></script>