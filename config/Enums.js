


/**
 * 层级选择组件模式
 */
export const CascadeSelectorType = {
    /**
     * 只有选到最后一级才算选择完成
     */
    last: 0,
    /**
     * 任何层级都可以选择
     */
    any: 1,
}


/**
 * 页面切换方向
 * @type {{horizontal: string, vertical: string}}
 */
export const TransitionType = {
    /**
     * 没有动画
     */
    none: "none",
    /**
     * 水平
     */
    horizontal: "horizontal",

    /**
     * 垂直
     */
    vertical: "vertical"
}