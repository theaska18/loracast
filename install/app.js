// var _mobile=false;
// if( navigator.userAgent.match(/Android/i)|| navigator.userAgent.match(/webOS/i)|| navigator.userAgent.match(/iPhone/i)
	// || navigator.userAgent.match(/iPad/i)|| navigator.userAgent.match(/iPod/i)|| navigator.userAgent.match(/BlackBerry/i)
 // || navigator.userAgent.match(/Windows Phone/i)){_mobile=true;} else {_mobile=false;}
Ext.define('ITextField', {extend: 'App.cmp.TextField',alias:'widget.itextfield',});
Ext.define('IDateField', {extend: 'App.cmp.DateField',alias:'widget.idatefield',});
Ext.define('IInput', {extend: 'App.cmp.Input',alias:'widget.iinput',});
Ext.define('IDropDown', {extend: 'App.cmp.DropDown',alias:'widget.idropdown',});
Ext.define('IHiddenField', {extend: 'App.cmp.HiddenField',alias:'widget.ihiddenfield',});
Ext.define('ICheckBox', {extend: 'App.cmp.CheckBox',alias:'widget.icheckbox',});
Ext.define('ITextArea', {extend: 'App.cmp.TextArea',alias:'widget.itextarea',});
Ext.define('IPanel', {extend: 'App.cmp.Panel',alias:'widget.ipanel',});
Ext.define('IWindow', {extend: 'App.cmp.Window',alias:'widget.iwindow',});
Ext.define('ITable', {extend: 'App.cmp.Table',alias:'widget.itable',});
Ext.define('ITableGrid', {extend: 'App.cmp.TableGrid',alias:'widget.itablegrid',});
Ext.define('IConfirm', {extend: 'App.cmp.Confirm',alias:'widget.iconfirm',});
Ext.define('IButtonFind', {extend: 'App.cmp.ButtonFind',alias:'widget.ibuttonfind',});
Ext.define('INumberField', {extend: 'App.cmp.NumberField',alias:'widget.inumberfield',});
Ext.define('ISelect', {extend: 'App.cmp.Select',alias:'widget.iselect',});
Ext.define('IListInput', {extend: 'App.cmp.ListInput',alias:'widget.ilistinput',});
Ext.define('IDynamicOption', {extend: 'App.cmp.DynamicOption',alias:'widget.idynamicoption',});
Ext.define('IFotoUpload', {extend: 'App.cmp.FotoUpload',alias:'widget.ifotoupload',});
Ext.define('IButtonNewTab', {extend: 'App.cmp.ButtonNewTab',alias:'widget.ibuttonnewtab',});
Ext.define('IButtonFullScreen', {extend: 'App.cmp.ButtonFullScreen',alias:'widget.ibuttonfullscreen',});
Ext.define('IToast', {extend: 'App.cmp.Toast',alias:'widget.itoast',});
Ext.define('IRadio', {extend: 'App.cmp.Radio',alias:'widget.iradio',});
Ext.define('IHtmlEditor', {extend: 'App.cmp.HtmlEditor',alias:'widget.ihtmleditor',});
Ext.define('IPayment', {extend: 'App.cmp.Payment',alias:'widget.ipayment',});
Ext.define('ISetting', {extend: 'App.cmp.Setting',alias:'widget.isetting',});
Ext.define('IConfig', {extend: 'App.cmp.Config',alias:'widget.iconfig',});
Ext.define('IDisplayField', {extend: 'App.cmp.DisplayField',alias:'widget.idisplayfield',});
Ext.define('IFileManager', {extend: 'App.cmp.FileManager',alias:'widget.ifilemanager',});
Ext.override(Ext.grid.RowNumberer, {
    renderer: function(value, metaData, record, rowIdx, colIdx, store) {
        var rowspan = this.rowspan;
        if (rowspan) {metaData.tdAttr = 'rowspan="' + rowspan + '"';}
        metaData.tdCls = Ext.baseCSSPrefix + 'grid-cell-special';
		return (this.table.pageSize*this.table.page)+rowIdx+1;
    }
});
Ext.define('AppOverrides.Button', {
	override: 'Ext.Button',
	renderTpl: ['<span id="{id}-btnWrap" class="{baseCls}-wrap', 
		'<tpl if="splitCls"> {splitCls}</tpl>', 
		'{childElCls}" unselectable="on">', 
		'<span id="{id}-btnEl" class="{baseCls}-button {baseCls}-hasBadge">', 
		'<span id="{id}-btnInnerEl" class="{baseCls}-inner {innerCls}', 
		'{childElCls}" unselectable="on">', 
		'{text}', 
		'</span>', 
		'<span id="{id}-btnBadge" class="{baseCls}-badgeCls ',
		'<tpl if="Ext.isEmpty(badgeText)">hide-badge</tpl>',
		'" reference="badgeElement" unselectable="on">{badgeText}</span>', 
		'<span role="img" id="{id}-btnIconEl" class="{baseCls}-icon-el {iconCls}', 
		'{childElCls} {glyphCls}" unselectable="on" style="margin:auto;', 
		'<tpl if="iconUrl">background-image:url({iconUrl});</tpl>', 
		'<tpl if="glyph && glyphFontFamily">font-family:{glyphFontFamily};</tpl>">', 
		'</span>', 
		'</span>', 
		'</span>',
		'<tpl if="closable">', '<span id="{id}-closeEl" class="{baseCls}-close-btn" title="{closeText}" tabIndex="0"></span>', '</tpl>'],
	getTemplateArgs: function() {
        var me = this,glyph = me.glyph,glyphFontFamily = Ext._glyphFontFamily,glyphParts;
        if (typeof glyph === 'string') {
            glyphParts = glyph.split('@');
            glyph = glyphParts[0];
            glyphFontFamily = glyphParts[1];
        }
        return {
            innerCls: me.getInnerCls(),splitCls: me.getSplitCls(),iconUrl: me.icon,iconCls: me.iconCls,glyph: glyph,glyphCls: glyph ? me.glyphCls : '',
            glyphFontFamily: glyphFontFamily,text: me.text || '&#160;',badgeText: me.badgeText || undefined
        };
    },
});
Ext.define('SIG.override.tree.Column', {
    override: 'Ext.tree.Column',
    cellTpl: [
        '<tpl for="lines">',
        '<div style="display: inline-block;" class="{parent.childCls} {parent.elbowCls}-img ',
        '{parent.elbowCls}-<tpl if=".">line<tpl else>empty</tpl>" role="presentation"></div>',
        '</tpl>',
        '<div style="display: inline-block;" class="{childCls} {elbowCls}-img {elbowCls}',
        '<tpl if="isLast">-end</tpl><tpl if="expandable">-plus {expanderCls}</tpl>" role="presentation"></div>',
        '<tpl if="checked !== null">',
        '<div style="display: inline-block;" role="button" {ariaCellCheckboxAttr}',
        ' class="{childCls} {checkboxCls}<tpl if="checked"> {checkboxCls}-checked</tpl>"></div>',
        '</tpl>',
        '<tpl if="icon"><img src="{blankUrl}"<tpl else><div</tpl>',
        '  style="display: inline-block;font-size:15px !important;" role="presentation" class="{childCls} {baseIconCls}',
        '<tpl if="iconCls == \'\'"> {customIconCls} ',
        '{baseIconCls}-<tpl if="leaf">leaf<tpl else><tpl if="expanded">parent-expanded<tpl else>parent</tpl></tpl></tpl> {iconCls}" ',
        '<tpl if="icon">style="background-image:url({icon})"/><tpl else>></div></tpl>',
        '<tpl if="href">',
        '<a href="{href}" role="link" target="{hrefTarget}" class="{textCls} {childCls}">{value}</a>',
        '<tpl else>',
        '<span class="{textCls} {childCls}">{value}</span>',
        '</tpl>'
    ]
});
Ext.define('SIG.override.toolbar.Toolbar', {
    override: 'Ext.toolbar.Toolbar',
	enableOverflow: true
});
if(_mobile==true){
	Ext.define('SIG.override.tooltip.Tooltip', {
		override: 'Ext.ToolTip',
		listeners: {
			beforeshow: function(tip) {return false;}
		}
	});
}
Ext.define('AppOverrides.grid.column.Action', {
	override: 'Ext.grid.column.Action',
	iconTpl: '<tpl for=".">' +
		'<tpl if="glyph">' +
		'<div class="{cls}" style="color:#04468c;margin: 0 auto; font-family:{glyphFamily};  font-size:15px; line-height: 15px;"<tpl if="tooltip"> data-qtip="{tooltip}"</tpl>>&#{glyph};</div>' +
		'<tpl else>' +
		'<div class="{cls}" <tpl if="tooltip"> data-qtip="{tooltip}"</tpl>></div>' +
		'</tpl>' +
		'</tpl>',
	defaultRenderer: function(v, meta, record, rowIdx, colIdx, store, view) {
		var me = this,
			prefix = Ext.baseCSSPrefix,scope = me.origScope || me,items = me.items,altText = me.altText,disableAction = me.disableAction,	
			enableAction = me.enableAction,iconCls = me.iconCls,len = items.length,i = 0,iconTpl = new Ext.XTemplate(me.iconTpl),datas = [],
			item, itemScope, ret, disabled, tooltip, glyph, cls, data;
		ret = Ext.isFunction(me.origRenderer) ? me.origRenderer.apply(scope, arguments) || '' : '';
		meta.tdCls += ' ' + Ext.baseCSSPrefix + 'action-col-cell';
		for (; i < len; i++) {
			item = items[i];
			itemScope = item.scope || scope;
			disabled = item.disabled || (item.isDisabled ? item.isDisabled.call(itemScope, view, rowIdx, colIdx, item, record) : false);
			tooltip = disabled ? null : (item.tooltip || (item.getTip ? item.getTip.apply(itemScope, arguments) : null));
			glyph = item.glyph || item.getGlyph;
			cls = Ext.String.trim(prefix + 'action-col-icon ' + prefix + 'action-col-' + String(i) + ' ' + (disabled ? prefix + 'item-disabled' : ' ') + ' ' + (Ext.isFunction(item.getClass) ? item.getClass.apply(itemScope, arguments) : (item.iconCls || iconCls || '')));
			data = {cls: cls,tooltip: tooltip};
			if (!item.hasActionConfiguration) {
				item.stopSelection = me.stopSelection;
				item.disable = Ext.Function.bind(disableAction, me, [i], 0);
				item.enable = Ext.Function.bind(enableAction, me, [i], 0);
				item.hasActionConfiguration = true;
			}
			if (glyph) {
				if (Ext.isFunction(glyph)) {glyph = glyph.call(itemScope, view, rowIdx, colIdx, item, record);}
				if (glyph) {
					glyph = glyph.split('@');
					data.glyph = glyph[0];
					data.glyphFamily = glyph[1];
				} else {data = false;}
			} else {
				data.alt = item.altText || altText;
				data.src = item.icon || Ext.BLANK_IMAGE_URL;
			}
			data && datas.push(data);
		}
		len && (ret += iconTpl.apply(datas));
		return ret;
	}
});
Ext.application({
	name : 'App',
	launch : function() {
		storage_auth();
		if(_single_page==false){
			var ses=_get_session(session_name,true),
				focusTab=ses.focusTab;
			Ext.create('App.system.Main');
			var mainEl=Ext.getCmp('main').getEl();
			mainEl.setOpacity(0);mainEl.fadeIn({duration: 1000});
			var c = mainMenu.store.getRootNode();
			function _runnable(list){
				for(var i=0,iLen=list.length; i<iLen; i++){
					var ObjL=list[i], hide=false,label='',autoTab=false;
					if(ObjL.raw != undefined){
						var label=ObjL.raw.text;
					}
					var notification=true;
					
					if(ObjL.childNodes != undefined && ObjL.childNodes != null){_runnable(ObjL.childNodes);}
					if(ObjL.raw.script != undefined && ObjL.raw.script != null){eval(ObjL.raw.script);}
					if(_var.notification == undefined){
						_var.notification={};
						_var.notificationList={};
					}
					if(hide==true){
						ObjL.remove(true);
						i--;
						iLen--;
					}
					_var.notification[ObjL.raw.code]=notification;
					_var.notificationList[ObjL.raw.code]=[];
					$('#menu-label-'+ObjL.raw.code).html(label);
					if(autoTab==true){
						var r=ObjL.raw;
						if(r.leaf==true && r.code != undefined){
							if(_mobile==true){
								Ext.getCmp('west-region-container').hide();
								Ext.getCmp('boxImage').hide();
								Ext.getCmp('btnHome').show();
							}
							var result = eval('(function() {' + r.load + 'return true;}())');
							if(result){Ext.getCmp('main').loadMenu({text:r.txt,code:r.code,role:r.role,script:r.script,update:r.update,icon:r.iconCls});}
						}else if(r.leaf==true && r.code == undefined){r.command();}	
					}
				}
			}
			loadMenuProfile();
			_runnable(c.childNodes);
			if(c.childNodes.length==0){
				Ext.getCmp('btnMenu').hide();
				Ext.getCmp('west-region-container').hide();
			}
			if(_mobile==true){Ext.getCmp('west-region-container').hide();}
			var tabFocus=Ext.getCmp(focusTab);
			if(focusTab != undefined && tabFocus != undefined){
				ses.focusTab=focusTab;
				_set_session(session_name,ses);
				Ext.getCmp('main.body').setActiveTab(tabFocus);
			}
		}else{Ext.create('App.system.MainSingle');}
	}
});
function storage_auth(){
	if(_clear_storage=='Y'){localStorage.removeItem(session_name);}
	var ses=_get_session(session_name,true);
	if(ses==undefined){ses={list:{}};}
	if(ses.list[_user_id]==undefined){ses.list[_user_id]={tab_list:_tab_list};}
	ses.user_id=_user_id;
	var tab_list=ses.list[_user_id].tab_list,ada=false,objR=null,objT=null;
	for(var i=0,iLen=tab_list.length; i<iLen; i++){
		objT=tab_list[i];
		 ada=false;
		for(var j=0,jLen=_role_list.length; j<jLen; j++){
			objR=_role_list[j];
			if(objT != undefined){
				if(objT.code==objR.code){
					objT['update']=objR.update;
					ada=true;
				}
			}
		}
		if(ada==false){tab_list.splice(i,1);}
	}
	ses.list[_user_id].tab_list=tab_list;
	_tab_list=tab_list;
	if(ses.mod == undefined){ses['mod']={};}
	if(ses.fun == undefined){ses['fun']={};}
	_set_session(session_name,ses);
}