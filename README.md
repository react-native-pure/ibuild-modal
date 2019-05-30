# ibuild-modal

Modal | 属性 | 说明
---- | ---|---
PageModal  | [PageModalProps](#pagemodalprops)| 页码切换modal
TreeModal | [TreeModalProps](#treemodalprops)| 层级选择modal 
TreeSelector | [TreeSelectorProps](#treeselectorprops) | 层级选择组件 
PopModal | [PopModalProps](#popmodalprops)| 底部弹出modal组件
ActionSheetModal | [ActionSheetModalProps](#actionsheetmodalprops)
CameraModal | [CameraProps](#cameraprops)| 拍照modal,支持拍照和拍摄视频 
GalleryViewerModal |[GalleryViewerModalProps](#calleryviewermodalprops|  画廊组件，支持视频和图片以及自定义Item
ImageEditModal |[ImageEditModalProps](#imageeditmodalprops)| 图片编辑
ListViewModel | [ListViewModelProps](#listviewmodelprops) | 
QRScanModal | [QRScanModalProps](#qrscanmodalprops)| 二维码扫描
ShareModal | [ShareModalProps](#sharemodalprops)| 分享
WheelModal | [WheelModalProps](#wheelmodalprops) | 滚轮选择

## Install

```bash
$ npm i @react-native-pure/ibuild-modal --save
```

## Documentaion

Quite easy to use TreeModal:

![The final rendering](./assets/gif/单列选择模式.gif)
![The final rendering](./assets/gif/多列任意选.gif)
![The final rendering](./assets/gif/多列单选.gif)
![The final rendering](./assets/gif/多选任意.gif)
![The final rendering](./assets/gif/多选到底.gif)

```
import React from 'react'
import {View,TouchableOpacity,Text,Alert} from 'react-native'
import {TreeModal,TreeSelectorModel}  from '@react-native-pure/ibuild-modal'
import update from "immutability-helper";


    constructor(props){
        super(props)
        this.state = {
            show:false,
            data:{	
                "sysNo": 1,
                "organizationCode": "1",
                "organizationFullName": "组织机构1",
                children:[{
                  "sysNo": 11,
                                "organizationCode": "11",
                                "organizationFullName": "组织机构11",
                  }]
                 	},
                 	 {
                 		"sysNo": 2,
                 		"organizationCode": "2",
                 		"organizationFullName": "组织机构2",
                 	}],
            selectedData:[],
            model:TreeSelectorModel.singleSelectAny
        }
    }

    updateState = (state: ImmutableHelperObject, callback: Function) => {
        if (this.state) {
            this.setState(
                update(this.state, state),
                callback
            );
        }
    }
    render(){
        return(<View style={{flex:1}}>
            <TouchableOpacity  style={{justifyContent: 'center',alignItems: 'center',flex:1}}
                               onPress={()=>{
                this.setState({
                    show:true
                })
            }}>
             <Text>show</Text>
            </TouchableOpacity>
            <TreeModal visible={this.state.show}
                       dataSource={this.state.data}
                       storageKey={"Key1"}
                       selectedDataSouce = {this.state.selectedData}
                       keyExtractor={(data)=>data.sysNo}
                       labelExtractor={(data)=>data.organizationFullName}
                       model={this.state.model}
                       onRequestClose={(info)=>{
                           this.setState({
                               show:false
                           })
                       }}
                       onChange={(currentItem,path)=>{
                           Alert.alert("change")
                       }}
                       onSelected={(currentItem,path)=>{
                           Alert.alert("选中")
                            this.updateState({
                                selectedData: {$push:[currentItem]}
                            })
                       }}
                       onUnSelected={(currentItem,path)=>{
                           Alert.alert(" 取消选中")
                           let index = this.state.selectedData.findIndex(x=>x.sysNo === currentItem.sysNo)
                           this.updateState({
                               selectedData: {$splice: [[index, 1]]}
                           })
                       }}
            />
        </View>)
    }

}

```


### TreeModal 
- [...`TreeModalProps`](#treemodalprops)
- [...`PageModalProps`](#pagemodaprops)


### TreeModalProps
- `dataSource` **Array<Object>** 
- `selectedDataSouce` **Array<Object>** 
- `loadDataFuc?` **(selectedItem:Object)=>Object**  点击网络数据
- `keyExtractor?` **(item: object) => string**  数据唯一标识，默认为 `sysNo`
- `labelExtractor?` **(item: object) => string**  显示文字的key,默认为`name`
- `model?` **()=>$Values<typeof [TreeSelectorModel](treeselectormodel)>**  选择模式，默认`singleSelectToEnd`
- `onChange?` **()=>(currentItem: Object,path:Array<Object>) => void**  选择改变时触发
- `onSelected?` **(currentItem: Object,path:Array<Object>) => void**  选中时触发
- `onUnSelected?` **(currentItem: Object,path:Array<Object>) => void** 取消选择时触发
- `lastSelectedPath?` **Array**  最后选择的全路径，如果提供将自动跳到上次选择的位置
- `maxLevel?` **number**  页最多显示多少列，默认为`10`
- `initLevel?` **number**  初始化显示列,默认为 `2`
- `storageKey?` **string**  提供一个字符串key用以保存历史选择数据以实现数据分离，如果不传的将使用默认key对历史选择数据进行保存
- `style?` **Object** 
- `onError?` **(message:string)=>void** 
- `hiddenHomeIcon?` **boolean**  是否隐藏header上home Icon
- `homeTitle?` **string** 初始化header 第一个位置的内容
- `showFullValue?` **boolean**  Item内容是否显示全路径
- `navbarStyle?` **[NavigationBarStyle](#navigationbarstyle)**
- `title?` **string**
- `onPressLeft?` **()=>void** 
- `onPressRight?` **()=>void** 
- `hiddenLeft?` **boolean** 
- `hiddenRight?` **boolean** 
- `renderLeft?` **React.ReactElement < any >** 
- `renderRight?` **React.ReactElement < any >** 
- `renderEmpty?` **React.ReactElement < any >** 



### TreeSelectorProps
- `dataSource` **Array<Object>** 
- `selectedDataSouce` **Array<Object>** 
- `loadDataFuc?` **(selectedItem:Object)=>Object**  点击网络数据
- `keyExtractor?` **(item: object) => string**  数据唯一标识，默认为 `sysNo`
- `labelExtractor?` **(item: object) => string**  显示文字的key,默认为`name`
- `model?` **()=>$Values<typeof [TreeSelectorModel](treeselectormodel)>**  选择模式，默认`singleSelectToEnd`
- `onChange?` **()=>(currentItem: Object,path:Array<Object>) => void**  选择改变时触发
- `onSelected?` **(currentItem: Object,path:Array<Object>) => void**  选中时触发
- `onUnSelected?` **(currentItem: Object,path:Array<Object>) => void** 取消选择时触发
- `lastSelectedPath?` **Array**  最后选择的全路径，如果提供将自动跳到上次选择的位置
- `maxLevel?` **number**  页最多显示多少列，默认为`10`
- `initLevel?` **number**  初始化显示列,默认为 `2`
- `storageKey?` **string**  提供一个字符串key用以保存历史选择数据以实现数据分离，如果不传的将使用默认key对历史选择数据进行保存
- `style?` **Object** 
- `onError?` **(message:string)=>void** 
- `hiddenHomeIcon?` **boolean**  是否隐藏header上home Icon
- `homeTitle?` **string** 初始化header 第一个位置的内容
- `showFullValue?` **boolean**  Item内容是否显示全路径
    

### PageModalProps
- `navbarStyle?` **[NavigationBarStyle](#navigationbarstyle)**
- `title?` **string**
- `onPressLeft?` **()=>void** 
- `onPressRight?` **()=>void** 
- `hiddenLeft?` **boolean** 
- `hiddenRight?` **boolean** 
- `renderLeft?` **React.ReactElement < any >** 
- `renderRight?` **React.ReactElement < any >** 
- `transition?` **$Values<typeof [TransitionType](#transitiontype)>** 


### NavigationBarStyle
####导航栏样式
- `title` **Object** title样式
- `leftButton` **Object** 左边按钮样式
- `rightButton` **Object** 右边按钮样式
- `contaner` **Object** 导航栏外层view样式

### TreeSelectorModel
####层级选择组件模式

 - `multiSelectToEnd`:"multiSelectToEnd" 多选，只有到最后一级
 - `multiSelectAny`:"multiSelectAny"  每一级都可以多选
 - `singleSelectToEnd`:"singleSelectToEnd" 单选，只有到最后一级
 - `singleSelectAny`:"singleSelectAny" 每一级都可以单选


### TransitionType 
####页面切换动画

 - `none`:"none" 没有动画
 - `horizontal`:"horizontal"  从右往左推出页面
 - `vertical`:"vertical" 从下往上推出页面

### PopModalProps 
 - `visible` **boolean** 
 - `onRequestClose` **()=>void** 
 - `onShown?` **()=>void** 
 - `onHidden?` **()=>void** 
 - `children?` **any* 
  
  
  
### ActionSheetModalProps
 - `visible` **boolean** 
 - `onRequestClose` **()=>void** 
 - `onShown?` **()=>void** 
 - `onHidden?` **()=>void** 
 - `children?` **any* 
 - `title?` **string**
 - `buttons?` **Array< [ActionSheetModalButton](#actionsheetmodalbutton)>**
 - `style?` **any**
 - `cancelType?`  **$Values< typeof [ActionSheetCancelButtonEnum](#actionsheetcancelbuttonenum)>**
  
    
### ActionSheetModalButton
 - `text` **boolean** 
 - `onPress` **(index:number)=>void** 


### ActionSheetCancelButtonEnum
- `cancel`: "cancel"
- `delete`: "delete"`


### CameraProps
 - `visible` **boolean** 
 - `onRequestClose` **([ImagePickerResult](#imagepickerresult))=>void** 
 - `onShown?` **()=>void** 
 - `onHidden?` **()=>void** 
 - `children?` **any* 
 - `onError?` **(err: Object) => void**
 - `type`  **$Values<typeof [ImagePickerMediaEnum](#imagepickermediaenum)>** 视频/拍照/视频和拍照
 - `transition?` **$Values<typeof [TransitionType](#transitiontype)>** 

    
### ImagePickerResult
 - `path` **string** 
 - `width` **number** 
 - `height` **number** 
 - `mime` **string** 
 - `size` **number** 
 - `modificationDate` **string** 
 
### ImagePickerMediaEnum
- `any`: "any"
- `photo`: "photo"`
- `video`: "video"

### GalleryViewerModalProps
 - `visible` **boolean** 
 - `onRequestClose` **([ImagePickerResult](#imagepickerresult))=>void** 
 - `onShown?` **()=>void** 
 - `onHidden?` **()=>void** 
 - `data` **Array<[ImageListPickerData](#imagelistpickerdata)>** 
 - `initIndex?` **number**  初始化显示第几张
 - `style?` **Object** 
 - `title?` **string** 
 - `renderFooter?` **(index: number) => React.ReactElement<any>** 
 - `renderHeader?` **(index: number) => React.ReactElement<any>** 
 - `renderIndicator?` **(data: Object, index: number) => React.ReactElement<any>** 
 - `onChange?` **(index: number) => void** 
 - `showIndicator?` **boolean**
 - `transition?` **$Values<typeof [TransitionType](#transitiontype)>** 


### ImageListPickerData
- `url` **String** 图片/视频url地址
- `type` **$Values< typeof [GalleryFileType](#galleryfiletype)>** 数据源类型
- `coverImageUrl?` **String** 视频封面图地址


### GalleryFileType
- `other`: -1
- `image`: 0 图片 
- `video`: 1  视频


### ImageEditModalProps
 - `path` **string** 本地图片地址
 - `sourceType` **$Values < typepf [ImageSourceEnum](#imagesourceenum)>** 本地图片地址
 - `visible` **boolean** 
 - `onRequestClose` **(data: [ImagePickerResult](#imagepickerresult) | null)=>void** 
 - `onShown?` **()=>void** 
 - `onHidden?` **()=>void** 
 - `onPressBack?` **()=>void** 
 - `onError?` **(error: Object)=>void** 
 - `address?` **string** 水印地址
 - `transition?` **$Values<typeof [TransitionType](#transitiontype)>** 

### ImageSourceEnum
- `none`: "none"
- `album`: "album" 相册
- `camera`: "camera"  相机    

### ListViewModelProps
 - `visible` **boolean** 
 - `onRequestClose` **(data:any)=>void** 
 - `onShown?` **()=>void** 
 - `onHidden?` **()=>void** 
 - `data` **()=>Array<any>** 
 - `renderItem` **() => React.ReactElement<any>** 
 - `total` **number**   
 - `pageIndex` **number**    
 - `startPageNum?` **number**    
 - `onPageChange?` **(pageIndex:number)=>void**    
        
### QRScanModalProps
 - `visible` **boolean** 
 - `onRequestClose` **(data:any)=>void** 
 - `onShown?` **()=>void** 
 - `onHidden?` **()=>void** 
 - `transition?` **$Values< typeof [TransitionType](#transitiontype)>** 
 - `renderNavBar？` **() => React.ReactElement<any>** 
 - `barCodeTypes?` **Array<$Values<typeof [QRBarCodeEnum](#qrbarcodeenum)>>**   


### QRBarCodeEnum

- `aztec`: "aztec"
- `code128`: "code128" 
- `code39`: "code39"   
- `code39mod43`: "code39mod43"
- `code93`: "code93"
- `ean13`: "ean13"
- `ean8`: "ean8"
- `pdf417`: "pdf417"
- `qr`: "qr"
- `upce`: "upce"
- `interleaved2of5`: "interleaved2of5"
- `itf14`: "itf14"
- `datamatrix`: "datamatrix"


### ShareModalProps
 - `visible` **boolean** 
 - `onRequestClose` **(data:any)=>void** 
 - `onShown?` **()=>void** 
 - `onHidden?` **()=>void** 
 - `data` **[ShareData](#sharedata)**

### ShareData
 - `type` **$Values< typeof [ShareDataType](#sharedatatype)>** 
 - `desc` **string**  必填,页面的描述
 - `title` **string**  页面的标题
 - `url` **string**  页面的链接地址
 - `image` **string** 图片地址,可以是本地图片,也可以是远程图片

### ShareDataType
- `text`:"text"
- `url`:"url"

### PickerData
 - `key` **string** 
 - `value` **any** 


### WheelModalProps
 - `visible` **boolean** 
 - `onRequestClose` **(selectedValue?:any)=>void** 
 - `onShown?` **()=>void** 
 - `onHidden?` **()=>void** 
 - `transition?` **$Values<typeof [TransitionType](#transitiontype)>** 
 - `data` **[PickerData](#pickerdata)** 
 - `fontSize?` **number** 
 - `textOffset` **number** 
 - `selectedIndex` **number** 
 - `onIndexChange?` **(index: number, data: PickerData) => void** 
