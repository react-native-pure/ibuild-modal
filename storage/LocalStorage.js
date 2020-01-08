/**
 * @overview 文件描述
 * @author heykk
 */
import {AsyncStorage} from 'react-native'

export default {
    getItem: async (key:String,defaultValue)=>{
        let info = await AsyncStorage.getItem(key)
        if(!info){
            return defaultValue
        }
        return JSON.parse(info)
    },
    setItem:async (key:String,value:Object)=>{
        if (!value){
           await AsyncStorage.removeItem(key)
        }
        else{
            let info = JSON.stringify(value)
            await AsyncStorage.setItem(key,info)
        }
    },
    /**
     * 清除无用的常用数据
     * @param storageKey 存储key
     * @param data
     * @param keyName 唯一键名
     * @returns {Promise<void>}
     */
    cleanStorage: async (storageKey: String, data: Object, keyName: String) => {

        if (!data) {
            AsyncStorage.removeItem(storageKey)
        }
        let info = await AsyncStorage.getItem(storageKey)
        if (info) {
            const flatten = (arr) => {
                let result = arr.map(f => f[`${keyName}`]);
                for (let i = 0; i < arr.length; i++) {
                    const item = arr[i];
                    if (item.children) {
                        result = result.concat(flatten(item.children));
                    }
                }
                return result;
            }
            const flattenLabels = flatten(data);
            let list = JSON.parse(info)
            const newLogLabels = list.filter(f => flattenLabels.indexOf(f) >= 0);
            if(newLogLabels.length>0){
                AsyncStorage.setItem(storageKey,JSON.stringify(newLogLabels))
            }
            else{
                AsyncStorage.removeItem(storageKey)
            }
        }

    }
}