/*jslint vars: true , plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global bm_eventDispatcher, bm_generalUtils, bm_keyframeHelper*/
var bm_effectsHelper = (function () {
    'use strict';
    var ob = {};
    var effectTypes = {
        sliderControl: 0,
        angleControl: 1,
        colorControl: 2,
        pointControl: 3,
        checkboxControl: 4,
        group: 5,
        noValue: 6,
        dropDownControl: 7,
        customValue: 9
    };
    
    function getEffectType(name) {
        switch (name) {
        case 'ADBE Slider Control':
            return effectTypes.sliderControl;
        case 'ADBE Angle Control':
            return effectTypes.angleControl;
        case 'ADBE Color Control':
            return effectTypes.colorControl;
        case 'ADBE Point Control':
            return effectTypes.pointControl;
        case 'ADBE Checkbox Control':
            return effectTypes.checkboxControl;
        default:
            bm_eventDispatcher.log(name);
            return '';
        }
    }
    
    function findEffectPropertyType(prop) {
        var propertyValueType = prop.propertyValueType;
        //customValue
            /*bm_eventDispatcher.log('prop.propertyValueType: ' + prop.propertyValueType);
            bm_eventDispatcher.log('PropertyValueType.COLOR: ' + PropertyValueType.COLOR);
            bm_eventDispatcher.log('PropertyValueType.OneD: ' + PropertyValueType.OneD);*/
        //Prop ertyValueType.NO_VALUE
        if (propertyValueType === PropertyValueType.NO_VALUE) {
            return effectTypes.noValue;
        } else if (propertyValueType === PropertyValueType.OneD) {
             if (!prop.isInterpolationTypeValid(KeyframeInterpolationType.LINEAR)){
                return effectTypes.dropDownControl;
             }
            return effectTypes.sliderControl;
        } else if (propertyValueType === PropertyValueType.COLOR) {
            return effectTypes.colorControl;
        } else if (propertyValueType === PropertyValueType.CUSTOM_VALUE) {
            return effectTypes.customValue;
        } else {
            return effectTypes.pointControl;
        }
        return '';
    }
    
    function exportNoValueControl(effect, frameRate) {
        var ob = {};
        ob.ty = effectTypes.noValue;
        ob.nm = effect.name;
        ob.ix = effect.propertyIndex;
        ob.v = 0;
        return ob;
    }
    
    function exportSliderControl(effect, frameRate) {
        var ob = {};
        ob.ty = effectTypes.sliderControl;
        ob.nm = effect.name;
        ob.ix = effect.propertyIndex;
        ob.v = bm_keyframeHelper.exportKeyframes(effect, frameRate);
        return ob;
    }
    
    function exportAngleControl(effect, frameRate) {
        var ob = {};
        ob.ty = effectTypes.angleControl;
        ob.nm = effect.name;
        ob.ix = effect.propertyIndex;
        ob.v = bm_keyframeHelper.exportKeyframes(effect, frameRate);
        return ob;
    }
    
    function exportColorControl(effect, frameRate) {
        var ob = {};
        ob.ty = effectTypes.colorControl;
        ob.nm = effect.name;
        ob.ix = effect.propertyIndex;
        ob.v = bm_keyframeHelper.exportKeyframes(effect, frameRate);
        return ob;
    }
    
    function exportPointControl(effect, frameRate) {
        var ob = {};
        ob.ty = effectTypes.pointControl;
        ob.nm = effect.name;
        ob.ix = effect.propertyIndex;
        ob.v = bm_keyframeHelper.exportKeyframes(effect, frameRate);
        return ob;
    }
    
    function exportCheckboxControl(effect, frameRate) {
        var ob = {};
        ob.ty = effectTypes.checkboxControl;
        ob.nm = effect.name;
        ob.ix = effect.propertyIndex;
        ob.v = bm_keyframeHelper.exportKeyframes(effect, frameRate);
        return ob;
    }
    
    function exportDropDownControl(effect, frameRate) {
        var ob = {};
        ob.ty = effectTypes.dropDownControl;
        ob.nm = effect.name;
        ob.ix = effect.propertyIndex;
        ob.v = bm_keyframeHelper.exportKeyframes(effect, frameRate);
        return ob;
    }
    
    function exportCustomControl(effect, frameRate){
        var ob = {};
        return ob;
    }
    
    function iterateEffectProperties(effectElement) {
        var i, len = effectElement.numProperties;
        for (i = 0; i < len; i += 1) {
            var prop = effectElement.property(i + 1);
            var propsArray = [], propValue;
            for (var s in prop) {
                propsArray.push({key:s,value:''});
            }
            /* bm_eventDispatcher.log(propsArray);
            bm_eventDispatcher.log('prop.name: ' + prop.name);
            bm_eventDispatcher.log('prop.matchName: ' + prop.matchName);
            bm_eventDispatcher.log('prop.propertyType: ' + prop.propertyType);
            bm_eventDispatcher.log('prop.propertyValueType: ' + prop.propertyValueType);
            bm_eventDispatcher.log('prop.hasMax: ' + prop.hasMax);
            bm_eventDispatcher.log('prop.hasMin: ' + prop.hasMin);
            if(prop.hasMax){
                bm_eventDispatcher.log('prop.maxValue: ' + prop.maxValue);
            }
            if(prop.hasMin){
                bm_eventDispatcher.log('prop.minValue: ' + prop.minValue);
            }
            bm_eventDispatcher.log('----------------');*/
        }
    }
    
    function exportCustomEffect(elem, frameRate) {
        var ob = {};
        ob.ty = effectTypes.group;
        ob.nm = elem.name;
        ob.ix = elem.propertyIndex;
        ob.ef = [];
        var i, len = elem.numProperties, prop;
        for (i = 0; i < len; i += 1) {
            prop = elem.property(i + 1);
            if(prop.propertyType === PropertyType.PROPERTY){
                var type = findEffectPropertyType(prop);
                //effectTypes.noValue;
                if (type === effectTypes.noValue) {
                    ob.ef.push(exportNoValueControl(prop, frameRate));
                } else if(type === effectTypes.sliderControl) {
                    ob.ef.push(exportSliderControl(prop, frameRate));
                } else if(type === effectTypes.colorControl) {
                    ob.ef.push(exportColorControl(prop, frameRate));
                } else if(type === effectTypes.dropDownControl) {
                    ob.ef.push(exportDropDownControl(prop, frameRate));
                } else if(type === effectTypes.dropDownControl) {
                    ob.ef.push(exportDropDownControl(prop, frameRate));
                } else if(type === effectTypes.customValue) {
                    ob.ef.push(exportCustomControl(prop, frameRate));
                } else {
                    ob.ef.push(exportPointControl(prop, frameRate));
                }
            } else {
                if(prop.name !== 'Compositing Options' && prop.matchName !== 'ADBE Effect Built In Params' && prop.propertyType !== PropertyType.NAMED_GROUP) {
                    ob.ef.push(exportCustomEffect(prop, frameRate));
                }
            }
        }
        return ob;
    }
    
    function exportEffects(layerInfo, layerData, frameRate) {
        //bm_eventDispatcher.log('PropertyType.PROPERTY' + PropertyType.PROPERTY);
        //bm_eventDispatcher.log('PropertyType.INDEXED_GROUP' + PropertyType.INDEXED_GROUP);
        //bm_eventDispatcher.log('PropertyType.NAMED_GROUP' + PropertyType.NAMED_GROUP);
        if (!(layerInfo.effect && layerInfo.effect.numProperties > 0)) {
            return;
        }
        var effects = layerInfo.effect;
       
        var i, len = effects.numProperties, effectElement;
        var effectsArray = [];
        for (i = 0; i < len; i += 1) {
            effectElement = effects(i + 1);
            effectsArray.push(exportCustomEffect(effectElement, frameRate));
            /*var effectType = getEffectType(effectElement.matchName);
            switch (effectType) {
            case effectTypes.sliderControl:
                effectsArray.push(exportSliderControl(effectElement.property('Slider'), frameRate));
                break;
            case effectTypes.angleControl:
                effectsArray.push(exportAngleControl(effectElement.property('Angle'), frameRate));
                break;
            case effectTypes.colorControl:
                effectsArray.push(exportColorControl(effectElement.property('Color'), frameRate));
                break;
            case effectTypes.pointControl:
                effectsArray.push(exportPointControl(effectElement.property('Point'), frameRate));
                break;
            case effectTypes.checkboxControl:
                effectsArray.push(exportCheckboxControl(effectElement.property('Checkbox'), frameRate));
                break;
            default:
                //iterateEffectProperties(effectElement);
                effectsArray.push(exportCustomEffect(effectElement, frameRate));
            }*/
        }
        if (effectsArray.length) {
            layerData.ef = effectsArray;
        }
    }
    
    ob.exportEffects = exportEffects;
    
    return ob;
}());