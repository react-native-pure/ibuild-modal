/**
 * @overview 文件描述
 * @author heykk
 */

/**
 * Created by yzw on 2018/3/22..
 *  -支持多级同时显示和只显示单级模式: 当层级数大于maxListLevel时会自动显示成单级别模式
 *  -支持单选和多选 : 通过multiselect属性控制，true多选，false单选。
 *  -支持分组显示 : 数据源中如果有header字段，将自动根据header自动进行分组
 *  -支持本地历史记录 : 通过historyKey属性控制，如果historyKey不为空，选择的数据将自动存储到本地，然后列表中会多处一行常用
 *  -支持点击内容和箭头响应不同操作 : 通过type属性控制，当type=1时，左右操作不同
 *  -支持默认固定显示多少分区：通过initLevel来控制，当initLevel为true时，如果选择层级大于initLevel时，前面已选层级则不会再显示
 *  -支持两种数据模式，一种是一次性加载，一种是点一级加载一级；
 *  -默认通过数据源中的children来判断是否还有下一级，当没有下一级的时候，点击操作就是选中操作；
 *  也可通过在数据源中添加与属性lastLevelKey一样的字段来控制此数据源是否是最后一级数据源
 */
import React,{Component} from 'react'
import {Dimensions, ScrollView, SectionList, StyleSheet, Text, TouchableOpacity, View,Image,Alert} from 'react-native'
import PropTypes from 'prop-types'
import {BorderColor, MainBuleColor} from '../config/DefaultTheme'
import RadioCell from '../../components/basic/RadioCell';
import ProjectStorage from "../storage/LocalStorage";
import {CascadeSelectorType} from "../../config/enums.config";

const DEVICE_SIZE = Dimensions.get("window");


const ErrorType = {
    noData:-1
}


export function dataSouceMapping(data, keyName = "sysNo", valueName = "name") {
    if (!data) {
        return null
    }
    let list = []
    for (let i = 0; i < data.length; i++) {
        let item = Object.assign({}, data[i]);
        item.key = item[keyName] ? item[keyName] : item[valueName]
        item.value = item[valueName]
        if (!!item.children || item.childCount > 0) {
            item.haveChildren = true;
            item.children = dataSouceMapping(item.children, keyName, valueName)
        }
        else if (item.childs && item.childs.length > 0) {
            item.haveChildren = true;
            item.children = dataSouceMapping(item.childs, keyName, valueName)
        }
        else {
            item.haveChildren = false;
        }
        list.push(item)
    }
    return list;
}

export default class CascadeSelector extends Component {

    static propTypes = {
        onFinish: PropTypes.func.isRequired,
        onChanged: PropTypes.func,
        dataSource: PropTypes.array.isRequired, //数组，数组格式必须字段模版 [{key:1,value:'12',haveChildren:true,children:[]}]
        selectedDataSouce: PropTypes.array,
        lastSelectedPath: PropTypes.array,//上一次选中路径
        loadDataFuc: PropTypes.func, //支持数据下载
        style: PropTypes.object,
        maxListLevel: PropTypes.number,//最大的列表显示层级，如果数据源层级大于列表层级将按照顶部显示层级，下面显示内容的方式展示
        multiselect: PropTypes.bool, //是否支持多选，默认不支持;注意：只有type==last时才支持多选
        lastLevelKey: PropTypes.string, //表示是最后一级的key,key对应的内容是bool值，如果有这个值，则使用这个值来判断是否是最后一级，否则使用children是空就是最后一级的逻辑判断
        type: PropTypes.number, // 0 cell左右均为往下级选择的操作，1 cell左边为选中，右边为往下级选的操作
        historyKey: PropTypes.string, //历史记录，有的话就会多显示常用一项
        initLevel: PropTypes.number, //初始化显示层级数
        showFullValue: PropTypes.bool,
        homeTitle: PropTypes.string,//初始化header 第一个位置的内容
        hiddenHomeIcon: PropTypes.bool,//是否隐藏header上home Icon
        onError:PropTypes.func
    };

    static defaultProps = {
        maxListLevel: 0,
        type: CascadeSelectorType.last,
        dataSource: [],
        multiselect: false,
        initLevel: 0,
        showFullValue: true,
    };

    constructor(props) {
        super(props);
        this.state = {
            currentSelectPath: !!props.lastSelectedPath ? props.lastSelectedPath : [],
            dataSource: this.arrayCopy(props.dataSource),
            selectedData: this.arrayCopy(!!props.selectedDataSouce && props.multiselect ? props.selectedDataSouce : [])
        };
    }

    componentDidMount() {
        super.componentDidMount();
        this.dealHistoryAsync(this.props)
        if (!!this.props.lastSelectedPath && this.props.lastSelectedPath.length > 0) {
            this.onNextPress(this.props.lastSelectedPath[this.props.lastSelectedPath.length - 1], this.props.lastSelectedPath.length - 1)
        }
    }

    componentWillReceiveProps(props) {
        this.setState({
            currentSelectPath: !!props.lastSelectedPath ? props.lastSelectedPath : [],
            selectedData: !!props.selectedDataSouce && props.multiselect ? props.selectedDataSouce : []
        });
    }

    componentWillUnmount() {
        super.componentWillUnmount()
    }

    arrayCopy(array) {
        if (array && Array.isArray(array)) {
            let list = [];
            array.forEach(a => {
                list.push(Object.assign(a))
            })
            return list;
        }
        return []
    }


    /**
     * 处理历史记录
     *
     * @param {props} object
     * */
    async dealHistoryAsync(props) {
        let datasouce = this.arrayCopy(!!props.dataSource ? props.dataSource : [])
        if (props.historyKey) {
            let historyItem = await this.initialHistoryAsync();
            if (!!historyItem) {
                datasouce.unshift(historyItem)
            }
            this.updateState({
                dataSource: {$set: datasouce},
            })
        }
    }

    findItem(sysNo) {
        const find = (arr, parents = []) => {
            let list = this.arrayCopy(arr);
            for (let i = 0; i < list.length; i++) {
                const item = list[i];
                if (item.key === sysNo) {
                    return [...parents, item];
                }
                else if (item.children) {
                    const nextParents = find(item.children, [...parents, item]);
                    if (nextParents) {
                        return nextParents;
                    }
                }
            }
            return null;
        }
        const path = find(this.props.dataSource);
        if (path && path.length > 0) {
            return {
                ...path[path.length - 1],
                path: path.slice(0, path.length - 1),
                fullValue: path.map(f => f.value).join(">")
            };
        }
        return null;
    }

    /**
     * 初始化历史数据，组装成可以识别的数据格式
     * */
    async initialHistoryAsync() {
        const key = this.props.historyKey;
        if (key) {
            /**所有常用数据的sysNo**/
            const itemSysNoes = await ProjectStorage.getItem(key, []);
            let items = []
            itemSysNoes.forEach((sysNo) => {
                let item = this.findItem(sysNo);
                if (item) {
                    items.push(item)
                }
            })
            if(items.length>0){
                return {
                    value: "常用",
                    key: 0,
                    isHistoryPath: true,
                    children: items,
                    haveChildren: itemSysNoes.length > 0 ? true : false
                }
            }
        }
        return null;
    }

    /**
     * 判断当前页面是应该显示单列表结构还是分区多列表结构；
     *
     * @return {Bool} true-显示分区多列表结构，false-显示单列表结构
     * */
    showListTree() {

        if (this.props.maxListLevel === 0 || this.props.maxListLevel === 1) {
            return false
        }
        else if (this.state.currentSelectPath.length < this.props.maxListLevel) {
            return true
        }
        else {
            return false
        }
    }

    async saveLogs(itemSysNo) {
        const key = this.props.historyKey;
        if (key) {
            const logs = await ProjectStorage.getItem(key, []);
            const index = logs.indexOf(itemSysNo);
            if (index < 0) {
                return ProjectStorage.setItem(key, [itemSysNo, ...logs]);
            }
        }
    }

    finishDataSelected(seletedItem, level) {
        let paths = this.state.currentSelectPath;
        paths.splice(level, paths.length - level);

        let list = this.state.selectedData;
        list.push(seletedItem);
        this.setState({selectedData: list, currentSelectPath: paths}, () => {

            let result = this.getFullValue(list);
            this.saveLogs(seletedItem.key);
            this.props.onFinish(result, this.state.currentSelectPath)
            this.setState({
                selectedData: [],
                currentSelectPath: []
            })
        })
    }

    /**
     * 点击某一行
     * @param item
     * @param level
     */
    onCellPress(item, level) {
        if (this.props.type === CascadeSelectorType.any) {
            if (item.isHistoryPath) {
                this.onNextPress(item, level)
            }
            else {
                this.finishDataSelected(item, level)
            }
        }
        else if (this.props.type === CascadeSelectorType.last) {
            if (item.haveChildren) {
                this.onNextPress(item, level)
            }
            else {
                this.finishDataSelected(item, level);
            }
        }
    }

    /**
     * 点击下一级
     * @param selecteItem
     * @param level
     */
    async onNextPress(selecteItem, level, callBack) {
        if (!selecteItem) {
            this.setState({currentSelectPath: []}, () => {
                this.props.onChanged && this.props.onChanged(null)
            })
            return
        }
        if (selecteItem.isHistoryPath && (!selecteItem.children || selecteItem.children.length === 0)) {
            if(this.props.onError){
                this.props.onError(ErrorType.noData)
            }
            else{
                Alert.alert("没有记录")
            }
            return;
        }
        let updateState = {}
        /**需要下载数据**/
        if (!!this.props.loadDataFuc && !selecteItem.children) {
            let newData = await this.props.loadDataFuc(selecteItem);
            selecteItem.children = this.arrayCopy(newData)
            updateState.currentSelectPath = {$splice: [[level, this.state.currentSelectPath.length - level, selecteItem]]}
        }
        /**不需要下载数据**/
        else {
            updateState.currentSelectPath = {$splice: [[level, this.state.currentSelectPath.length - level, selecteItem]]}
        }
        this.updateState(updateState, () => {
            setTimeout(() => {
                this.headerScrollView && this.headerScrollView.scrollToEnd()
            }, 1)
            this.props.onChanged && this.props.onChanged(this.state.currentSelectPath)
            callBack && callBack()
        })
    }

    /**
     * 多选按钮
     * @param selecteItem
     * @param level
     */
    onRadioPress(selecteItem, level) {

        let updateState = {}
        updateState.currentSelectPath = {$splice: [[level, this.state.currentSelectPath.length - level]]}

        if (this.isSelected(selecteItem)) {
            let index = this.getSelectedItenIndex(selecteItem);
            updateState.selectedData = {$splice: [[index, 1]]}
        }
        else {
            updateState.selectedData = {$push: [selecteItem]}
        }
        this.updateState(updateState)
    }

    /**
     * 拼接带有路径的显示值
     * */
    getFullValue(list) {
        let result = [];
        for (let i = 0; i < list.length; i++) {
            let item = Object.assign({}, list[i])

            let value = ""
            let isFormHistory = false
            for (let j = 0; j < this.state.currentSelectPath.length; j++) {
                let parentItem = this.state.currentSelectPath[j];

                if (parentItem.isHistoryPath && this.state.currentSelectPath.length == 1) {
                    return list;
                }
                else if (parentItem.isHistoryPath) {
                    isFormHistory = true;
                }
                else {
                    if (isFormHistory && !!parentItem.fullValue) {
                        value = value + parentItem.fullValue + '>'
                    }
                    else {
                        value = value + parentItem.value + '>'
                    }

                }
            }
            item.fullValue = value + item.value;
            item.path = this.state.currentSelectPath;
            result.push(item)
        }
        return result;
    }

    isSelected(seletedItem) {

        if (!!this.state.selectedData) {
            for (let i = 0; i < this.state.selectedData.length; i++) {
                let item = this.state.selectedData[i];
                if (item.key === seletedItem.key && seletedItem.value === item.value) {
                    return true
                }
            }
        }
        return false
    }


    getSelectedItenIndex(seletedItem) {
        for (let i = 0; i < this.state.selectedData.length; i++) {
            let item = this.state.selectedData[i];
            if (item.key === seletedItem.key && seletedItem.value === item.value) {
                return i
            }
        }
        return 0
    }

    multSelectFinish = ()=> {
        if (this.state.selectedData.length > 0) {
            let result = this.getFullValue(this.state.selectedData)
            this.props.onFinish(result, this.state.currentSelectPath)
            this.setState({
                selectedData: [],
                currentSelectPath: []
            })
        }
    }


    mappingSectionData(data) {

        if (!data) {
            return []
        }
        let list = [];
        for (let i = 0; i < data.length; i++) {
            let item = data[i];
            let currentSection = null;

            for (let j = 0; j < list.length; j++) {
                let section = list[j];
                if (`${section.key}` == `${item.header}`) {
                    currentSection = section;
                    break
                }
            }
            if (!currentSection) {
                currentSection = {
                    key: `${item.header}`,
                    data: [item]
                }
                list.push(currentSection)
            }
            else {
                currentSection.data.push(item)
            }
        }
        return list;
    }

    renderHeader(data) {
        if (data.section.key != 'undefined') {
            return <View style={style.section}>
                <Text style={[{color: '#b5b5b5',fontSize:12}]}>{data.section.key}</Text>
            </View>
        }
        else {
            return <View/>;
        }
    }


    /**
     * 分区多列表页面渲染
     * @param {data}        object
     * @param {selecteItem} number  当前行的层级数
     * */
    renderListView(data, level) {

        let r = 255;
        r = r - level * 5;
        if (r < 10) {
            r = 10
        }
        let selecteItemStyle = {
            backgroundColor: '#e9e9e9',
            borderBottomWidth: 0,
            borderTopWidth: 0
        }

        let unSelecteItemSytle = {
            backgroundColor: `rgb(${r},${r},${r})`,
            borderBottomWidth: 0,
            borderTopWidth: 0
        }

        return <SectionList
            key={level}
            showsVerticalScrollIndicator={false}
            sections={this.mappingSectionData(data)}
            renderSectionHeader={this.renderHeader.bind(this)}
            style={{
                flex: 1,
                backgroundColor: `rgb(${r},${r},${r})`,
                borderRightWidth: StyleSheet.hairlineWidth,
                borderRightColor: '#e6e6e6'
            }}
            renderItem={({item}) => {
                return <RadioCell
                    type={this.props.type}
                    style={((this.state.currentSelectPath.length > level && item.key === this.state.currentSelectPath[level].key) ? selecteItemStyle : unSelecteItemSytle)}
                    onCellPress={() => {
                        this.onCellPress(item, level)
                    }}
                    onNextPress={() => {
                        this.onNextPress(item, level, null)
                    }}
                    onRadioPress={() => {
                        this.onRadioPress(item, level)
                    }}
                    text={(this.props.showFullValue && !!item.fullValue) ? item.fullValue : item.value}
                    data={item}
                    selected={this.isSelected(item)}
                    showRadio={!!(this.props.type === CascadeSelectorType.last && !item.haveChildren && !!this.props.multiselect && !item.isHistoryPath)}
                    showArrow={!!item.haveChildren}/>
            }}/>

    }


    /**
     * 单列表页面渲染
     *
     * @param {data}        object
     * @param {selecteItem} number  当前行的层级数
     * */
    renderSingleListView(data, level) {
        return <SectionList
            key={level}
            showsVerticalScrollIndicator={false}
            sections={this.mappingSectionData(data)}
            renderSectionHeader={this.renderHeader.bind(this)}
            style={{flex: 1, backgroundColor: '#fff'}}
            renderItem={({item}) => {
                return <RadioCell
                    type={this.props.type}
                    style={{
                        borderTopWidth: 0,
                        borderBottomColor: BorderColor,
                        borderBottomWidth: StyleSheet.hairlineWidth
                    }}
                    onCellPress={() => {
                        this.onCellPress(item, level)
                    }}
                    onNextPress={() => {
                        this.onNextPress(item, level, null)
                    }}
                    onRadioPress={() => {
                        this.onRadioPress(item, level)
                    }}
                    text={!!item.fullValue ? item.fullValue : item.value}
                    data={item}
                    selected={this.isSelected(item)}
                    showRadio={!!(this.props.type === CascadeSelectorType.last && !item.haveChildren && !!this.props.multiselect && !item.isHistoryPath)}
                    showArrow={!!item.haveChildren}/>
            }}/>
    }

    render() {
        return (
            <View style={[style.flexContainer, this.props.style]}>
                <View style={style.header}>
                    <ScrollView ref={refs => {
                        this.headerScrollView = refs;
                    }}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={style.headerScroll}
                                horizontal={true}>

                        {/**头部导航**/}
                        <TouchableOpacity style={style.flexRow}
                                          onPress={() => {
                                              this.onNextPress(null, 0)
                                          }}>
                            {!this.props.hiddenHomeIcon && <Image source={require('../assets/home-outline.png')}
                                                                  style={{width:18,height:18,tintColor:(this.state.currentSelectPath === null || this.state.currentSelectPath.length === 0) ? MainBuleColor:'#979797' }}/>}
                            {this.props.homeTitle && <Text
                                style={[{marginHorizontal: 5,fontSize:14}, (this.state.currentSelectPath === null || this.state.currentSelectPath.length === 0) ? {color: MainBuleColor} : {color:"#979797"}]}>{this.props.homeTitle}</Text>}
                            {this.state.currentSelectPath && this.state.currentSelectPath.length > 0 &&
                            <Image source={require('../assets/chevron-right.png')}/>}
                        </TouchableOpacity>
                        {this.state.currentSelectPath.map((item, index) => {
                            return <TouchableOpacity key={index}
                                                     onPress={() => {
                                                         this.onNextPress(item, index)
                                                     }}
                                                     style={style.flexRow}>
                                <Text
                                    style={[index === this.state.currentSelectPath.length - 1 ? {color: MainBuleColor} : {color:'#979797'}, {fontSize:14,marginHorizontal: 5}]}>{item.value}</Text>
                                {this.state.currentSelectPath.length > index + 1 && <Image source={require('../assets/chevron-right.png')}/>}
                            </TouchableOpacity>
                        })}
                    </ScrollView>
                </View>

                {/**多列表**/}
                {this.showListTree() && this.state.dataSource.length > 0 && <View style={style.listTreeBox}>
                    {this.state.currentSelectPath.length <= this.props.initLevel && this.renderListView(this.state.dataSource, 0)}
                    {this.state.currentSelectPath.length > 0 && this.props.initLevel <= this.state.currentSelectPath.length && this.state.currentSelectPath.map((item, index) => {
                        if (index >= this.state.currentSelectPath.length - this.props.initLevel - 1) {
                            return this.renderListView(item.children, index + 1)
                        }
                    })
                    }
                    {!!this.props.initLevel && this.props.initLevel > this.state.currentSelectPath.length && Array.apply(null, {length: this.props.initLevel - 1}).map((i, index) => {
                        let item = {children: []};
                        if (index < this.state.currentSelectPath.length) {
                            item = this.state.currentSelectPath[index]
                        }
                        return this.renderListView(item.children, index + 1)
                    })}

                </View>}

                {/**单列表**/}
                {!this.showListTree() && this.state.dataSource.length > 0 && <View style={{flex: 1}}>
                    {(!this.state.currentSelectPath || this.state.currentSelectPath.length === 0) && this.renderSingleListView(this.state.dataSource, 0)}
                    {(!!this.state.currentSelectPath && this.state.currentSelectPath.length > 0) && this.renderSingleListView(this.state.currentSelectPath[this.state.currentSelectPath.length - 1].children, this.state.currentSelectPath.length)}
                </View>}

                {this.props.multiselect && this.props.type === CascadeSelectorType.last && this.state.dataSource.length > 0 &&
                <TouchableOpacity style={this.state.selectedData.length > 0?style.button:style.disableButton}
                                  onPress={this.multSelectFinish}
                                  activeOpacity={this.state.selectedData.length > 0?0.5:1.0}>
                    <Text style={this.state.selectedData.length > 0? style.butText:style.disableText}>完成</Text>
                </TouchableOpacity>}
            </View>
        );
    }
}

const style = StyleSheet.create({
    flexContainer: {
        flex: 1
    },
    listTreeBox: {
        flexDirection: 'row',
        flex: 1
    },
    listTreeItem: {
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    header: {
        backgroundColor: '#fff',
        borderBottomColor: '#e6e6e6',
        borderBottomWidth: StyleSheet.hairlineWidth,
        height: 45,
        width: DEVICE_SIZE.width
    },
    headerScroll: {
        paddingHorizontal: 15,
    },
    section: {
        padding: 10,
        backgroundColor: '#e9e9e9'
    },
    flexRow: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    button: {
        backgroundColor: "#339CFA",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: 50
    },
    butText:{
        color: "white",
        fontSize: 16
    },
    disableButton: {
        backgroundColor: "#339CFA",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: 50,
        opacity: 0.5
    },
    disableText: {
        color: "white",
        fontSize: 16
    }

})
