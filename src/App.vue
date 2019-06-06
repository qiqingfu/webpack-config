<template>
    <div id="app">
        <h2>基于 Webpack4 从0搭建Vue开发环境</h2>
        <ul>
            <li>支持移动端环境</li>
        </ul>
    </div>
</template>
<script>
export default {
    name: 'App'
}
</script>
<style lang="scss">
    * {
        margin: 0;
        padding: 0;
        user-select: none;
    }
    #app {
        text-align: center;
        margin-top: 80px;
        letter-spacing: .8px;
        color: #3b3b3b;
    }

    ul {
        margin-top: 60px; 
        padding-right: 160px;
        li {
            margin: 10px 0;
            position: relative;
            &::before {
                content: "•";
                position: relative;
                left: -12px;
                top: 0;
                color: orange;
            }
        }
    }
</style>