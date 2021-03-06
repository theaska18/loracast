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
function start_up(){
	Ext.application({
		name : 'App',
		launch : function() {
			if(_single_page==false){
				Ext.create('IMain');
				
			}else{Ext.create('IMainSingle');}
		}
	});
}
function storage_auth(){
	if(_clear_storage=='Y'){localStorage.removeItem(session_name);}
	_local_storage=JSON.parse(localStorage.getItem(session_name));
	if(_local_storage==null){_local_storage={list:{}};}
	if(_local_storage.list[_user_id]==undefined){_local_storage.list[_user_id]={tab_list:_tab_list};}
	_local_storage.user_id=_user_id;
	var tab_list=_local_storage.list[_user_id].tab_list,ada=false,objR=null,objT=null;
	function storage_auth_menuList(objTf,lst){
		var adaf=false;
		for(var j=0,jLen=lst.length; j<jLen; j++){
			objRf=lst[j];
			if(objT != undefined){
				if(objTf.code==objRf.code){
					objTf['update']=objRf.update;
					adaf=true;
					break;
				}
			}
			if(objRf['children'] != undefined && adaf==false){
				adaf=storage_auth_menuList(objTf,objRf['children']);
			}else if(objRf['menu'] != undefined && adaf==false){
				adaf=storage_auth_menuList(objTf,objRf['menu']);
			}
		}
		return adaf;
	}
	for(var i=0,iLen=tab_list.length; i<iLen; i++){
		objT=tab_list[i];
		ada=storage_auth_menuList(objT,_menu_list);
		if(ada==false){tab_list.splice(i,1);}
	}
	_local_storage.list[_user_id].tab_list=tab_list;
	_tab_list=tab_list;
	if(_local_storage.mod == undefined){_local_storage['mod']={};}
	if(_local_storage.fun == undefined){_local_storage['fun']={};}
	if(_local_storage.imports == undefined){_local_storage['imports']={};}
	_set_session(session_name,_local_storage);
}