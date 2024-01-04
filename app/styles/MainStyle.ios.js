
import { Dimensions, PixelRatio, Platform } from 'react-native';
const
    font = 'System',
    AppColorGreen2 = '#7ED321',
    FontColor = '#34495E';

module.exports = {

    BGColor: 'white',
    BGColor2: '#EEEEE9',
    AppColorBlue: '#00BCD4',
    AppColorGreen: '#34495E',
    AppColorGreen2: AppColorGreen2,
    FontColor: FontColor,

    inputColor: '#F8F1A2',
    inputColorWrong: '#F9CCBE',
    inputColorSuccess: '#DCF9BE',

    HeaderTintColor: 'white',

    imageBG: require('../image/BG.png'),

    font: font,
    fontMedium: font,

    _width: Dimensions.get('window').width,
    _height: Dimensions.get('window').height,

    headerHeight: 50,
    statusBarHeight: 20,
    statusBarBackgroundColor: '#4297C1',

    input: {
        borderWidth: 1,
        borderColor: "#eee",
        borderRadius: 3,
        color: 'black',
        fontSize: 14,
        paddingHorizontal: 15,
        lineHeight: 15,
        height: 40,
        backgroundColor: "#f8f8f8",
        fontFamily: font,
    },
    inputPlaceholderColor: '#999',

    separatorHeight: 1 / PixelRatio.get(),
    separatorColor: '#e1e1e1',


    taskIndicator:{
        height: 3,
        backgroundColor: 'rgba(0,0,0,.2)',
    },
    stroke:{
        width: 0,
        height: 3,
        backgroundColor: 'white',
    },


    titleBlock:{
        backgroundColor: '#eee',
        height: 56,
        // alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    titleBlockText:{
        color: FontColor,
        fontFamily: font,
        fontSize: 20,
        fontWeight: 'bold'
    },




    headerContainer:{
        width: Dimensions.get('window').width * 0.5,
    },
    headerTitleStyle:{
        color: 'white',
        fontFamily: font,
        fontWeight: 'bold',
        fontSize: 17,
        textAlign: 'center',
    },
    headerSubtitle:{
        color: 'white',
        fontFamily: font,
        fontSize: 12,
        textAlign: 'center',

    },


    headerBtn:{
        paddingHorizontal: 15,
    },
    // changeLatBtn:{
    //     backgroundColor: 'white',
    //     paddingHorizontal: 6,
    //     paddingVertical: 4,
    //     borderRadius: 4,
    // },
    // changeLatBtnText:{
    //     fontFamily: font,
    //     fontSize: 10,
    //     color: '#00BCD4',
    //     fontWeight: 'bold'
    // }

    changeLatBtn:{
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    changeLatBtnText:{
        fontFamily: font,
        fontSize: 10,
        color: 'white',
        textAlign: 'right',
        marginRight: 5,
    }




};
