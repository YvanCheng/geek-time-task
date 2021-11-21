<template>
    <div>
        {{ tip }} world
    </div>
</template>

<script>

module.exports = {
    data: function() {
        return {
            tip: "hello"
        }
    }
};
</script>

<style scoped>
    div {
        font-size: 16px;
        text-align: center;
    }
</style>