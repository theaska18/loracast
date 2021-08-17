/*
	import cmp.ilistinput
	import cmp.isetting
	import cmp.itextarea
	import cmp.icomboquery
	import cmp.ipanel
	import PARAMETER.iparameter
*/
shortcut.set({
	code:'main',
	list:[
		{
			key:'f5',
			fn:function(){_click('MENU.btnRefresh');} 
		},{
			key:'f6',
			fn:function(){_click('MENU.btnAdd');}
		}
	]
});
new Ext.Panel({
	id : 'MENU.main',
	layout:'fit',
	border:false,
	items : [
		{
			xtype:'treepanel',
			id : 'MENU.list',
			border : false,
			rootVisible : false,
			lines : true,
			flex:1,
			rowLines : true,
			root : {
				expanded : false
			},
			tbar : [iif(_mobile,'<b>Menu</b>',''),{xtype:'ibuttonnewtab'},{xtype:'ibuttonfullscreen'},'->',
				{
					text: iif(_mobile,null,'Tambah'),
					tooltip:'Tambah <b>[F6]</b>',
					iconCls: 'fa fa-plus fa-green',
					id:'MENU.btnAdd',
					handler : function(a) {
						_access('MENU_ADD',function(){
							Ext.getCmp('MENU.input').closing = false;
							Ext.getCmp('MENU.input.panel').qReset();
							Ext.getCmp('MENU.input.pc').setValue(null);
							Ext.getCmp('MENU.input.f1').setReadOnly(false);
							Ext.getCmp('MENU.input.f9').setReadOnly(false);
							Ext.getCmp('MENU.input.f3').setReadOnly(false);
							Ext.getCmp('MENU.input.f8').enable();
							Ext.getCmp('MENU.input.p').setValue('ADD');
							Ext.getCmp('MENU.input.access').hide();
							Ext.getCmp('MENU.input.panel').qSetForm();
							// Ext.getCmp('MENU.input').setTitle('Menu - Tambah');
							Ext.getCmp('MENU.list').hide();
							Ext.getCmp('MENU.input').show();
							Ext.getCmp('MENU.input.f1').focus();
						});
					}
				},{
					xtype:'buttongroup',
					id:'MENU.group.search',
					items:[
						{
							xtype:'icomboquery',
							id : 'MENU.f1',
							query:'SELECT group_id as id,group_name AS text FROM app_menu_group WHERE active_flag=1 AND group_id in(select distinct(group_id) from app_menu) ORDER by group_name',
							name : 'f1',
							emptyText: 'Grup Menu',
							width: 200,
							press:{
								enter:function(){
									_click('MENU.btnRefresh');
								}
							},
							margin:false,
						},{
							tooltip:'Refresh <b>[F5]</b>',
							id:'MENU.btnRefresh',
							iconCls: 'fa fa-refresh',
							handler : function(a) {
								Ext.Ajax.request({
									url : url + 'cmd?m=MENU&f=getList',
									params:{
										group:Ext.getCmp('MENU.f1').getValue()
									},
									method : 'GET',
									before:function(){
										Ext.getCmp('main.tabMENU').setLoading(true);
									},
									success : function(response) {
										Ext.getCmp('main.tabMENU').setLoading(false);
										var r = ajaxSuccess(response);
										if (r.r == 'S') {
											Ext.getCmp('MENU.list').store.setRootNode([]);
											var c = Ext.getCmp('MENU.list').store.getRootNode();
											c.insertChild(1, r.d);
											Ext.getCmp('MENU.list').expandAll()
										}
									},
									failure : function(jqXHR, exception) {
										Ext.getCmp('main.tabMENU').setLoading(false);
										ajaxError(jqXHR, exception,true);
									}
								});
							}
						}
					]
				}
			],
			columns : [
				{
					xtype : 'treecolumn',
					text : 'Nama Menu',
					flex : 1,
					menuDisabled : true,
					sortable:false,
					minWidth: 200,
					dataIndex : 'text'
				},{
					text : 'Tambah',
					width : 55,
					hideable:false,
					menuDisabled : true,
					xtype : 'actioncolumn',
					align : 'center',
					iconCls : 'fa fa-plus fa-green',
					handler : function(grid, rowIndex, colIndex, actionItem, event,record, row) {
						_access('MENU_ADD',function(){
							Ext.getCmp('MENU.input.panel').qReset();
							Ext.getCmp('MENU.input.pc').setValue(record.raw.f1);
							Ext.getCmp('MENU.input').closing = false;
							Ext.getCmp('MENU.input.f1').setReadOnly(false);
							Ext.getCmp('MENU.input.f9').setReadOnly(true);
							Ext.getCmp('MENU.input.f3').setReadOnly(false);
							Ext.getCmp('MENU.input.p').setValue('ADD');
							Ext.getCmp('MENU.input.f8').disable();
							Ext.getCmp('MENU.input.access').hide();
							Ext.getCmp('MENU.input.access').resetTable();
							Ext.getCmp('MENU.input.panel').qSetForm();
							// Ext.getCmp('MENU.input').setTitle('Menu - Tambah');
							Ext.getCmp('MENU.list').hide();
							Ext.getCmp('MENU.input').show();
							Ext.getCmp('MENU.input.f1').focus();
						});
					},
					isDisabled : function(view, rowIdx, colIdx, item, record) {
						return record.data.leaf;
					}
				}, {
					text : 'Edit',
					width : 55,
					menuDisabled : true,
					xtype : 'actioncolumn',
					align : 'center',
					iconCls : 'fa fa-edit',
					handler : function(grid, rowIndex, colIndex, actionItem, event,record, row) {
						_access('MENU_UPDATE',function(){
							Ext.Ajax.request({
								url : url + 'cmd?m=MENU&f=initUpdate',
								method : 'GET',
								params:{i:record.raw.f1},
								before:function(){
									Ext.getCmp('main.tabMENU').setLoading(true);
								},
								success : function(response) {
									Ext.getCmp('main.tabMENU').setLoading(false);
									var r = ajaxSuccess(response);
									if (r.r == 'S') {
										Ext.getCmp('MENU.input.panel').qReset();
										var o=r.d.o;
										Ext.getCmp('MENU.input.pc').setValue(record.raw.f1);
										Ext.getCmp('MENU.input').closing = false;
										Ext.getCmp('MENU.input.f1').setReadOnly(true);
										Ext.getCmp('MENU.input.f1').setValue(o.f1);
										Ext.getCmp('MENU.input.f2').setValue(o.f2);
										Ext.getCmp('MENU.input.f3').setValue(o.f3);
										Ext.getCmp('MENU.input.f4').setValue(o.f4);
										Ext.getCmp('MENU.input.f5').setValue(o.f5);
										Ext.getCmp('MENU.input.f8').setValue(o.f8);
										if(o.f9 == null){
											Ext.getCmp('MENU.input.f8').enable();
										}else{
											Ext.getCmp('MENU.input.f8').disable();
										}
										if(o.f9==null){
											Ext.getCmp('MENU.input.f9').setReadOnly(false);
										}else{
											Ext.getCmp('MENU.input.f9').setReadOnly(true);
										}
										if(o.c>0){
											Ext.getCmp('MENU.input.f3').setReadOnly(true);
										}else{
											Ext.getCmp('MENU.input.f3').setReadOnly(false);
										}
										Ext.getCmp('MENU.input.f6').setValue(o.f6);
										Ext.getCmp('MENU.input.f7').setValue(o.f7);
										Ext.getCmp('MENU.input.f9').setValue(o.f10);
										Ext.getCmp('MENU.input.p').setValue('UPDATE');
										// Ext.getCmp('MENU.input').setTitle('Menu - Edit');
										Ext.getCmp('MENU.list').hide();
										Ext.getCmp('MENU.input').show();
										if(o.f3=='MENUTYPE_FOLDER'){
											Ext.getCmp('MENU.input.access').hide();
										}else{
											Ext.getCmp('MENU.input.access').show();
											var list=r.d.l2,obj={},table=Ext.getCmp('MENU.input.access');
											table.resetTable();
											for(var i=0,iLen=list.length; i<iLen;i++){
												obj=list[i];
												if(i!==0){
													table._add(true);
												}
												table._get('access_type',i).setValue(obj.access_type);
												table._get('menu_access_id',i).setValue(obj.menu_access_id);
												table._get('component_id',i).setValue(obj.component_id);
												table._get('component_name',i).setValue(obj.component_name);
												table._get('active',i).setValue(obj.active);
												table._get('take',i).setValue(obj.take);
												table._get('del',i).disable();
											}
											table._getAddButton().disable();
										}
										Ext.getCmp('MENU.input.panel').qSetForm();
										Ext.getCmp('MENU.input.f2').focus();
									}
								},
								failure : function(jqXHR, exception) {
									Ext.getCmp('main.tabMENU').setLoading(false);
									ajaxError(jqXHR, exception,true);
								}
							});
						});
					}
				},{
					text : 'Setting',
					width : 55,
					menuDisabled : true,
					xtype : 'actioncolumn',
					align : 'center',
					iconCls : 'fa fa-cog',
					isDisabled : function(view, rowIdx, colIdx, item, record) {
						return !record.data.leaf;
					},
					handler : function(grid, rowIndex, colIndex, actionItem, event,record, row) {
						_access('MENU_SETTING',function(){
							Ext.Ajax.request({
								url : url + 'cmd?m=MENU&f=initSetting',
								method : 'GET',
								params:{i:record.raw.f1},
								before:function(){
									Ext.getCmp('main.tabMENU').setLoading(true);
								},
								success : function(response) {
									Ext.getCmp('main.tabMENU').setLoading(false);
									var r = ajaxSuccess(response);
									if (r.r == 'S') {
										Ext.getCmp('MENU.setting.panel').qReset();
										var o=r.d.o;
										Ext.getCmp('MENU.setting.i').setValue(o.menu_id);
										Ext.getCmp('MENU.setting').closing = false;
										Ext.getCmp('MENU.setting.f1').setValue(record.raw.f1);
										Ext.getCmp('MENU.setting.f2').setValue(o.menu_name);
										Ext.getCmp('MENU.list').hide();
										Ext.getCmp('MENU.setting').show();
										var list=r.d.l,obj={},table=Ext.getCmp('MENU.setting.list');
										table.resetTable();
										for(var i=0,iLen=list.length; i<iLen;i++){
											obj=list[i];
											if(i!==0){
												table._add();
											}
											table._get('setting_id',i).setValue(obj.setting_id);
											table._get('setting_code',i).setValue(obj.setting_code);
											table._get('setting_code',i).setReadOnly(true);
											table._get('setting_name',i).setValue(obj.setting_name);
											table._get('setting_desc',i).setValue(obj.setting_desc);
											table._get('setting_value',i).setValue(obj.setting_value);
											table._get('setting_object',i).setValue(obj.setting_object);
											table._get('setting_type',i).setValue(obj.setting_type);
											table._get('setting_group',i).setValue(obj.setting_group);
											table._get('setting_index',i).setValue(obj.setting_index);
										}
										var cmpList=Ext.getCmp('MENU.setting.list2');
										cmpList.menu_code=record.raw.f1;
										cmpList.level=0;
										cmpList.refresh();
										Ext.getCmp('MENU.setting.panel').qSetForm();
										Ext.getCmp('MENU.setting.list')._focus();
									}
								},
								failure : function(jqXHR, exception) {
									Ext.getCmp('main.tabMENU').setLoading(false);
									ajaxError(jqXHR, exception,true);
								}
							});
						});
					}
				}, {
					text : 'Hapus',
					width : 55,
					menuDisabled : true,
					xtype : 'actioncolumn',
					align : 'center',
					iconCls : 'fa fa-trash fa-red',
					handler : function(grid, rowIndex, colIndex, actionItem, event,record, row) {
						_access('MENU_DELETE',function(){
							if(record.data.children==null || record.data.children.length==0){
								Ext.getCmp('MENU.confirm').confirm({
									msg : "Apakah Akan Menghapus Menu Kode '"+record.raw.f1+"' ?",
									allow : 'MENU.delete',
									onY : function() {
										Ext.Ajax.request({
											url : url + 'cmd?m=MENU&f=delete',
											method : 'POST',
											params : {
												i : record.raw.f1
											},
											before:function(){
												Ext.getCmp('main.tabMENU').setLoading(true);
											},
											success : function(response) {
												Ext.getCmp('main.tabMENU').setLoading(false);
												var r = ajaxSuccess(response);
												if (r.r == 'S') {
													Ext.Ajax.request({
														url : url + 'cmd?m=MENU&f=getList',
														params:{
															group:Ext.getCmp('MENU.f1').getValue()
														},
														method : 'GET',
														before:function(){
															Ext.getCmp('main.tabMENU').setLoading('Mengambil Data');
														},
														success : function(response) {
															Ext.getCmp('main.tabMENU').setLoading(false);
															var r = ajaxSuccess(response);
															if (r.r == 'S') {
																Ext.getCmp('MENU.list').store.setRootNode([]);
																var c = Ext.getCmp('MENU.list').store.getRootNode();
																c.insertChild(1, r.d);
																Ext.getCmp('MENU.list').expandAll()
															}
														},
														failure : function(jqXHR, exception) {
															Ext.getCmp('main.tabMENU').setLoading(false);
															ajaxError(jqXHR, exception,true);
														}
													});
												}
											},
											failure : function(jqXHR, exception) {
												Ext.getCmp('main.tabMENU').setLoading(false);
												ajaxError(jqXHR, exception,true);
											}
										});
									}
								});
							}else{
								Ext.create('IToast').toast({msg : 'Tidak dapat dihapus karena masih memiliki sub menu.',type : 'warning'});
							}
						});
					}
				}
			]
		},{
			id 		: 'MENU.input',
			hidden 	: true,
			border:false,
			// title:'Menu',
			layout:'fit',
			listeners:{
				show:function(){
					shortcut.set({
						code:'input',
						list:[
							{
								key:'ctrl+s',
								fn:function(){
									_click('MENU.input.btnSave');
								}
							},{
								key:'esc',
								fn:function(){
									_click('MENU.input.btnClose');
								}
							}
						]
					});
				},
				hide:function(){
					shortcut.remove('input');
				}
			},
			tbar 	: [
				{
					xType : 'button',
					text : 'Keluar',
					tooltip:'Keluar <b>[Esc]</b>',
					id:'MENU.input.btnClose',
					iconCls : 'fa fa-chevron-left fa-red',
					handler : function() {
						var req=Ext.getCmp('MENU.input.panel').qGetForm();
						if(req == false){
							Ext.getCmp('MENU.confirm').confirm({
								msg :'Apakah Akan Mengabaikan data Yang sudah Berubah ?',
								allow : 'MENU.close',
								onY : function() {
									Ext.getCmp('MENU.input').hide();
									Ext.getCmp('MENU.list').show();
								}
							});
						}else{
							Ext.getCmp('MENU.input').hide();
							Ext.getCmp('MENU.list').show();
						}
					}
				},'->','<b>Input Menu</b>','->',{
					xType 	: 'button',
					text 	: 'Simpan',
					tooltip	:'Simpan <b>[Ctrl+s]</b>',
					id		: 'MENU.input.btnSave',
					iconCls 	: 'fa fa-save fa-green',
					handler : function() {
						var req=Ext.getCmp('MENU.input.panel').qGetForm(true);
						if (req== false) 
							Ext.getCmp('MENU.confirm').confirm({
								msg : 'Apakah Akan Save Data ini ?',
								allow : 'MENU.save',
								onY : function() {
									var param = Ext.getCmp('MENU.input.panel').qParams();
									Ext.Ajax.request({
										url : url + 'cmd?m=MENU&f=save',
										method : 'POST',
										params : param,
										before:function(){
											Ext.getCmp('MENU.input').setLoading(true);
										},
										success : function(response) {
											Ext.getCmp('MENU.input').setLoading(false);
											var r = ajaxSuccess(response);
											if (r.r == 'S') {
												Ext.getCmp('MENU.input').hide();
												Ext.getCmp('MENU.list').show();
												Ext.Ajax.request({
													url : url + 'cmd?m=MENU&f=getList',
													params:{
														group:Ext.getCmp('MENU.f1').getValue()
													},
													method : 'GET',
													before:function(){
														Ext.getCmp('main.tabMENU').setLoading('Loading');
													},
													success : function(response) {
														Ext.getCmp('main.tabMENU').setLoading(false);
														var r = ajaxSuccess(response);
														if (r.r == 'S') {
															Ext.getCmp('MENU.list').store.setRootNode([]);
															var c = Ext.getCmp('MENU.list').store.getRootNode();
															c.insertChild(1, r.d);
															Ext.getCmp('MENU.list').expandAll()
														}
													},
													failure : function(jqXHR, exception) {
														Ext.getCmp('main.tabMENU').setLoading(false);
														ajaxError(jqXHR, exception,true);
													}
												});
											}
										},
										failure : function(jqXHR, exception) {
											Ext.getCmp('MENU.input').setLoading(false);
											ajaxError(jqXHR, exception,true);
										}
									});
								}
							});
						else{
							if(Ext.getCmp('MENU.input.p').getValue()=='ADD'){
								Ext.create('IToast').toast({msg : 'Periksa Kembali Datanya.',type : 'warning'});
							}else{
								Ext.create('IToast').toast({msg : 'Tidak ada Perbubahan Data.',type : 'warning'});
							}
						}
					}
				}
			],
			items : [
				{
					xtype:'ipanel',
					id : 'MENU.input.panel',
					submit:'MENU.input.btnSave',
					layout:'column',
					items : [
						{
							xtype:'form',
							columnWidth:.33,
							border:false,
							minWidth:350,
							items : [
								{
									xtype:'ihiddenfield',
									id : 'MENU.input.pc',
									name : 'pc'
								},{
									xtype:'ihiddenfield',
									id : 'MENU.input.p',
									name : 'p'
								},{
									xtype:'itextfield',
									id : 'MENU.input.f1',
									submit:'MENU.input.panel',
									property:{
										upper:true,
										space:false
									},
									name : 'f1',
									maxLength:16,
									fieldLabel:'Kode Menu',
									allowBlank : false
								},{
									xtype:'itextfield',
									id : 'MENU.input.f2',
									submit:'MENU.input.panel',
									property:{
										dynamic:true
									},
									maxLength:64,
									fieldLabel: 'Menu Name',
									name : 'f2',
									allowBlank : false
								},{
									xtype:'icomboquery',
									id : 'MENU.input.f9',
									submit:'MENU.input.panel',
									query:'SELECT group_id as id,group_name AS text FROM app_menu_group WHERE active_flag=1 ORDER by group_name',
									name : 'f9',
									fieldLabel: 'Grup Menu',
								},{
									xtype:'iparameter',
									id : 'MENU.input.f3',
									submit:'MENU.input.panel',
									parameter:'MENU_TYPE',
									name : 'f3',
									fieldLabel: 'Jenis Menu',
									allowBlank : false,
									listeners:{
										select:function(a){
											if(Ext.getCmp('MENU.input.p').getValue()!=='ADD'){
												if(a.getValue()=='MENUTYPE_FOLDER'){
													Ext.getCmp('MENU.input.access').hide();
												}else{
													Ext.getCmp('MENU.input.access').show();
												}
											}else{
												Ext.getCmp('MENU.input.access').hide();
											}
										}
									}
								},{
									xtype:'itextfield',
									id : 'MENU.input.f4',
									submit:'MENU.input.panel',
									name : 'f4',
									fieldLabel: 'Icon'
								},{
									xtype:'inumberfield',
									id : 'MENU.input.f7',
									submit:'MENU.input.panel',
									fieldLabel: 'Urut',
									name : 'f7',
									app:{decimal:0},
									width: 150,
									allowBlank : false
								}
							]
						},{
							xtype:'form',
							columnWidth:.33,
							border:false,
							minWidth:350,
							items : [
								{
									xtype:'itextarea',
									id : 'MENU.input.f5',
									submit:'MENU.input.panel',
									name : 'f5',
									fieldLabel: 'Keterangan'
								},{
									xtype:'icheckbox',
									id : 'MENU.input.f6',
									submit:'MENU.input.panel',
									name : 'f6',
									fieldLabel:'Aktif',
									checked:true,
								},{
									xtype:'icheckbox',
									id : 'MENU.input.f8',
									name : 'f8',
									fieldLabel:'Master',
									checked:false,
								}
							]
						},{
							xtype:'ilistinput',
							id:'MENU.input.access',
							height:200,
							columnWidth:.68,
							hidden:true,
							paddingBottom:false,
							minWidth: 336,
							name:'options',
							items:[
								{
									xtype:'iparameter',
									name:'access_type',
									parameter:'ACCESS_TYPE',
									submit:'MENU.input.panel',
									text:'Kode Opsi',
									emptyText:'Jenis Akses',
									readOnly:true,
									allowBlank: false,
									width: 100
								},{
									xtype:'ihiddenfield',
									name:'menu_access_id',
									text:''
								},{
									xtype:'itextfield',
									submit:'MENU.input.panel',
									name:'component_id',
									text:'Kode/ID',
									emptyText:'Kode/ID',
									allowBlank: false,
									readOnly:true,
									width: 200,
									property	:{
										space:false
									}
								},{
									xtype:'itextfield',
									name:'component_name',
									submit:'MENU.input.panel',
									text:'Nama Akses',
									allowBlank: false,
									// flex:1,
									width: 200,
									emptyText:'Nama Akses',
									readOnly:true,
									property	:{
										dynamic:true
									}
								},{
									xtype:'icheckbox',
									submit:'MENU.input.panel',
									name:'active',
									width: 40,
									align:'center',
									value:true,
									checked:true,
									readOnly:true,
									text:'Active'
								},{
									xtype:'icheckbox',
									submit:'MENU.input.panel',
									name:'take',
									align:'center',
									text:'Make',
									width: 40,
									listeners:{
										change:function(a){
											var table=Ext.getCmp('MENU.input.access');
											if(a.getValue()==true){
												table._get('active',a.line).setReadOnly(false);
												table._get('active',a.line).setValue(true);
												table._get('component_name',a.line).setReadOnly(false);
												table._get('component_name',a.line).focus();
											}else{
												table._get('active',a.line).setReadOnly(true);
												table._get('active',a.line).setValue(false);
												table._get('component_name',a.line).setReadOnly(true);
												// table._get('component_name',a.line).setValue('');
											}
										}
									}
								}
							]
						}
					]
				}
			],
		},{
			id 		: 'MENU.setting',
			hidden 	: true,
			border 	: false,
			layout 	: 'fit',
			// title	:'Menu - Setting',
			listeners:{
				show:function(){
					shortcut.set({
						code:'setting',
						list:[
							{
								key:'ctrl+s',
								fn:function(){
									_click('MENU.setting.btnSave');
								}
							},{
								key:'esc',
								fn:function(){
									_click('MENU.setting.btnClose');
								}
							}
						]
					});
				},
				hide:function(){
					shortcut.remove('setting');
				}
			},
			tbar 	: [
				{
					xType : 'button',
					text : 'Kembali',
					tooltip:'Kembali <b>[Esc]</b>',
					id:'MENU.setting.btnClose',
					iconCls : 'fa fa-chevron-left fa-red',
					handler : function() {
						var req=Ext.getCmp('MENU.setting.panel').qGetForm();
						if(req == false){
							Ext.getCmp('MENU.confirm').confirm({
								msg :'Apakah Akan Mengabaikan data Yang sudah Berubah ?',
								allow : 'MENU.close',
								onY : function() {
									Ext.getCmp('MENU.setting').hide();
									Ext.getCmp('MENU.list').show();
								}
							});
						}else{
							Ext.getCmp('MENU.setting').hide();
							Ext.getCmp('MENU.list').show();
						}
					}
				},'->','<b>Setting Menu</b>','->',{
					xtype 	: 'button',
					text 	: 'Simpan',
					tooltip	:'Simpan <b>[Ctrl+s]</b>',
					id		: 'MENU.setting.btnSave',
					iconCls 	: 'fa fa-save fa-green',
					handler : function() {
						var obj={},table=Ext.getCmp('MENU.setting.list');
						var jum=table._getTotal();
						var err=false;
						for(var i=0,iLen=jum; i<iLen;i++){
							for(var j=0,jLen=jum; j<jLen;j++){
								if(i!==j){
									if(table._get('setting_code',i).getValue()==table._get('setting_code',j).getValue()){
										Ext.create('IToast').toast({msg : 'Kode Tidak Boleh Sama.',type : 'error'});
										table._get('setting_code',i).focus();
										err=true;
										break;
									}
								}
							}
							if(err==true){
								break;
							}
						}
						if(err==false){
							var req=Ext.getCmp('MENU.setting.panel').qGetForm(true);
							if (req== false){ 
								Ext.getCmp('MENU.confirm').confirm({
									msg : 'Apakah Akan Save Data ini ?',
									allow : 'MENU.save',
									onY : function() {
										var param = Ext.getCmp('MENU.setting.panel').qParams();
										Ext.Ajax.request({
											url : url + 'cmd?m=MENU&f=saveSetting',
											method : 'POST',
											params : param,
											before:function(){
												Ext.getCmp('MENU.setting').setLoading(true);
											},
											success : function(response) {
												Ext.getCmp('MENU.setting').setLoading(false);
												var r = ajaxSuccess(response);
												if (r.r == 'S') {
													Ext.getCmp('MENU.setting.list2').refresh();
													var table=Ext.getCmp('MENU.setting.list'),
														idx=0;
													for(var i =0,iLen=table._getTotal();i<iLen;i++){
														if(table._get('setting_id',i).getValue()==''){
															table._get('setting_id',i).setValue(r.d[idx]);
															table._get('setting_code',i).setReadOnly(true);
															idx++;
														}
													}
													var cmpList=Ext.getCmp('MENU.setting.list2');
													cmpList.refresh();
													Ext.getCmp('MENU.setting.panel').qSetForm();
												}
											},
											failure : function(jqXHR, exception) {
												Ext.getCmp('MENU.setting').setLoading(false);
												ajaxError(jqXHR, exception,true);
											}
										});
									}
								});
							}else if(req==true){
								Ext.create('IToast').toast({msg : 'Tidak ada Perbubahan Data.',type : 'warning'});
							}
						}
					}
				}
			],
			items : [
				{
					xtype:'ipanel',
					id : 'MENU.setting.panel',
					submit:'MENU.setting.btnSave',
					layout:{
						type:'vbox',
						align:'stretch'
					},
					paddingBottom:false,
					width:900,
					items : [
						{
							xtype:'form',
							border:false,
							minWidth:350,
							items : [
								{
									xtype:'ihiddenfield',
									id : 'MENU.setting.i',
									name : 'i'
								},{
									xtype:'itextfield',
									id : 'MENU.setting.f1',
									readOnly:true,
									fieldLabel:'Kode Menu',
								},{
									xtype:'itextfield',
									id : 'MENU.setting.f2',
									readOnly:true,
									fieldLabel: 'Menu Name',
								}
							]
						},{
							xtype:'ilistinput',
							id:'MENU.setting.list',
							flex:1,
							name:'options',
							items:[
								{
									xtype:'ihiddenfield',
									name:'setting_id',
								},{
									xtype:'itextfield',
									name:'setting_code',
									text:'Kode',
									submit:'MENU.setting.panel',
									emptyText:'Kode',
									allowBlank: false,
									width: 100,
									property	:{
										space:false,
										upper:true
									}
								},{
									xtype:'iparameter',
									name:'setting_type',
									text:'Jenis Input',
									submit:'MENU.setting.panel',
									emptyText:'Jenis Input',
									allowBlank: false,
									width: 100,
									parameter:'INPUT_TYPE'
								},{
									xtype:'itextfield',
									submit:'MENU.setting.panel',
									name:'setting_name',
									text:'Nama',
									allowBlank: false,
									width:150,
									emptyText:'Nama',
									property	:{
										dynamic:true
									}
								},{
									xtype:'itextfield',
									name:'setting_value',
									submit:'MENU.setting.panel',
									text:'Nilai',
									width:200,
									maxLength:512,
									emptyText:'Nilai',
								},{
									xtype:'itextfield',
									submit:'MENU.setting.panel',
									name:'setting_desc',
									text:'Deskripsi',
									width:100,
									maxLength:256,
									emptyText:'Deskripsi',
								},{
									xtype:'itextfield',
									name:'setting_object',
									submit:'MENU.setting.panel',
									text:'Objek',
									width:300,
									maxLength:1024,
									emptyText:'Objek',
								},{
									xtype:'itextfield',
									name:'setting_group',
									submit:'MENU.setting.panel',
									text:'Group',
									width:100,
									maxLength:64,
									emptyText:'Group Name',
								},{
									xtype:'inumberfield',
									app:{decimal:0},
									name:'setting_index',
									submit:'MENU.setting.panel',
									text:'Index',
									width:100,
									maxLength:64,
									emptyText:'Index',
								}
							]
						},{
							xtype:'isetting',
							id : 'MENU.setting.list2',
						}
					]
				}
			],
			qBeforeClose : function() {
				var $this = this;
				$this.closing = false;
				if (Ext.getCmp('MENU.setting.panel').qGetForm() == false)
					Ext.getCmp('MENU.confirm').confirm({
						msg : 'Apakah Akan Mengabaikan Data ini ?',
						allow : 'MENU.close',
						onY : function() {
							$this.qClose();
						}
					});
				else
					$this.qClose();
				return false;
			}
		},
		{xtype:'iconfirm',id : 'MENU.confirm'}
	]
});