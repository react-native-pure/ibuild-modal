


/**
 * 层级选择组件模式
 */
export const TreeSelectorModel = {
    /**
     * 多选，只有到最后一级
     */
    multiSelectToEnd: "multiSelectToEnd",

    /**
     * 每一级都可以多选
     */
    multiSelectAny: "multiSelectAny",

    /**
     * 单选，只有到最后一级
     */
    singleSelectToEnd: "singleSelectToEnd",

    /**
     * 每一级都可以单选
     */
    singleSelectAny: "singleSelectAny",
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

export const ActionSheetCancelButtonEnum = {
    cancel: "cancel",
    delete: "delete"
}
