


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

/**
 * 图片来源
 * @type {{}}
 */
export const ImageSourceEnum = {
    none: "none",
    //相册
    album: "album",
    //相机
    camera: "camera"
}


export const ImagePickerMediaEnum = {
    any: "any",
    photo: "photo",
    video: "video",
};


export const ActionSheetCancelButtonEnum = {
    cancel: "cancel",
    delete: "delete"
}


/***
 * 二维码扫描类型
 * @type {{aztec: string, code128: string, code39: string, code39mod43: string, code93: string, ean13: string, ean8: string, pdf417: string, qr: string, upce: string, interleaved2of5: string, itf14: string, datamatrix: string}}
 */
export const QRBarCodeEnum = {
    aztec: "aztec",
    code128: "code128",
    code39: "code39",
    code39mod43: "code39mod43",
    code93: "code93",
    ean13: "ean13",
    ean8: "ean8",
    pdf417: "pdf417",
    qr: "qr",
    upce: "upce",
    interleaved2of5: "interleaved2of5",
    itf14: "itf14",
    datamatrix: "datamatrix",
}