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
    }
}