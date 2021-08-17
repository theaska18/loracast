/*
	import cmp.ihtmleditor
	import cmp.itextarea
	import cmp.ipanel
	import cmp.iconfig
	import cmp.itable
	import cmp.icombobox
	import cmp.idatefield
*/
shortcut.set({
	code:'main',
	list:[
		{
			key:'f5',
			fn:function(){
				Ext.getCmp('TEMPLATE.list').refresh();
			}
		},{
			key:'ctrl+shift+f',
			fn:function(){
				_click('TEMPLATE.btnShowSearch');
			}
		},{
			key:'f6',
			fn:function(){
				_click('TEMPLATE.btnAdd');
			}
		}
	]
});
new Ext.Panel({
	id : 'TEMPLATE.main',
	layout:'fit',
	border:false,
	items : [
		{
			xtype:'iwindow',
			iconCls:'fa fa-search',
			id:'TEMPLATE.search',
			modal:false,
			title:'Template - Pencarian',
			listeners:{
				show:function(){
					shortcut.set({
						code:'search',
						list:[
							{
								key:'esc',
								fn:function(){
									_click('TEMPLATE.search.btnSearch');
								}
							},{
								key:'ctrl+r',
								fn:function(){
									_click('TEMPLATE.search.btnReset');
								}
							},{
								key:'ctrl+s',
								fn:function(){
									_click('TEMPLATE.search.btnSearch');
								}
							},{
								key:'ctrl+f',
								fn:function(){
									Ext.getCmp('TEMPLATE.search.f1').focus();
								}
							}
						]
					});
				},
				hide:function(){
					shortcut.remove('search');
				}
			},
			fbar: [
				{
					text: 'Cari',
					tooltip:'Cari <b>[Ctrl+s]</b>',
					iconCls:'fa fa-search fa-green',
					id:'TEMPLATE.search.btnSearch',
					handler: function() {
						Ext.getCmp('TEMPLATE.list').refresh(true);
					}
				},{
					text: 'Reset',
					tooltip:'Reset <b>[Ctrl+r]</b>',
					iconCls:'fa fa-eraser fa-red',
					id:'TEMPLATE.search.btnReset',
					handler: function() {
						Ext.getCmp('TEMPLATE.search.panel').qReset();
					}
				},{
					text: 'Keluar',
					tooltip:'Keluar <b>[Esc]</b>',
					iconCls:'fa fa-close',
					id:'TEMPLATE.search.btnClose',
					handler: function() {
						Ext.getCmp('TEMPLATE.search').close();
					}
				}
			],
			items:[
				{
					xtype:'ipanel',
					id : 'TEMPLATE.search.panel',
					width: 350,
					items:[
						{
							xtype:'itextfield',
							name:'f1',
							fieldLabel:'Kode Template',
							press:{
								enter:function(){
									_click('TEMPLATE.search.btnSearch');
								}
							},
						},{
							xtype:'itextfield',
							name:'f2',
							fieldLabel:'Nama Template',
							press:{
								enter:function(){
									_click('TEMPLATE.search.btnSearch');
								}
							},
						},{
							xtype:'itextfield',
							name:'f3',
							fieldLabel:'Deskripsi',
							press:{
								enter:function(){
									_click('TEMPLATE.search.btnSearch');
								}
							},
						},{
							xtype:'iparameter',
							parameter:'ACTIVE_FLAG',
							name : 'f4',
							press:{
								enter:function(){
									_click('TEMPLATE.search.btnSearch');
								}
							},
							fieldLabel: 'Active'
						}
					]
				}
			]
		},{
			xtype:'itable',
			id:'TEMPLATE.list',
			params:function(bo){
				if(bo==true){
					return Ext.getCmp('TEMPLATE.search.panel').qParams();
				}else{
					var obj={};
					obj[Ext.getCmp('TEMPLATE.dropdown').getValue()]=Ext.getCmp('TEMPLATE.text').getValue();
					return obj;
				}
			},
			url:url + 'cmd?m=TEMPLATE&f=getList',
			result:function(response){
				return {list:response.d,total:response.t};
			},
			fn:{
				delete:function(a){
					_access('TEMPLATE_DELETE',function(){
						Ext.getCmp('TEMPLATE.confirm').confirm({
							msg : "Apakah akan Menghapus Artikel '"+a.f1+"' ?",
							allow : 'TEMPLATE.delete',
							onY : function() {
								Ext.Ajax.request({
									url : url + 'cmd?m=TEMPLATE&f=delete',
									method : 'POST',
									params : {
										i : a.i
									},
									before:function(){
										Ext.getCmp('TEMPLATE.list').setLoading(true);
									},
									success : function(response) {
										Ext.getCmp('TEMPLATE.list').setLoading(false);
										var r = ajaxSuccess(response);
										if (r.r == 'S'){
											// socket.send('USERMODULE','TEMPLATE','DELETE');
											Ext.getCmp('TEMPLATE.list').refresh();
										}
									},
									failure : function(jqXHR, exception) {
										Ext.getCmp('TEMPLATE.list').setLoading(false);
										ajaxError(jqXHR, exception);
									}
								});
							}
						});
					});
				},
				update:function(a){
					_access('TEMPLATE_UPDATE',function(){
						Ext.Ajax.request({
							url : url + 'cmd?m=TEMPLATE&f=initUpdate',
							params:{i:a.i},
							method : 'GET',
							before:function(){
								Ext.getCmp('TEMPLATE.list').setLoading(true);
							},
							success : function(response) {
								Ext.getCmp('TEMPLATE.list').setLoading(false);
								var r = ajaxSuccess(response);
								if (r.r == 'S') {
									var o=r.d.o;
									Ext.getCmp('TEMPLATE.input.panel').qReset();
									Ext.getCmp('TEMPLATE.input.i').setValue(a.i);
									Ext.getCmp('TEMPLATE.input.p').setValue('UPDATE');
									Ext.getCmp('TEMPLATE.input.f1').setValue(o.f1);
									Ext.getCmp('TEMPLATE.input.f1').setReadOnly(true);
									Ext.getCmp('TEMPLATE.input.f2').setValue(o.f2);
									Ext.getCmp('TEMPLATE.input.f3').setValue(o.f3);
									Ext.getCmp('TEMPLATE.input.f5').setValue(o.f5);
									Ext.getCmp('TEMPLATE.input.f4').setValue(o.f4);
									Ext.getCmp('TEMPLATE.input').closing = false;
									Ext.getCmp('TEMPLATE.list').hide();
									Ext.getCmp('TEMPLATE.input').show();
									Ext.getCmp('TEMPLATE.input.f2').focus();
									Ext.getCmp('TEMPLATE.input.panel').qSetForm();
								}
							},
							failure : function(jqXHR, exception) {
								Ext.getCmp('TEMPLATE.list').setLoading(false);
								ajaxError(jqXHR, exception);
							}
						});
					});
				},
			},
			press:{
				delete:function(a){
					Ext.getCmp('TEMPLATE.list').fn.delete(a.dataRow);
				},
				enter:function(a){
					Ext.getCmp('TEMPLATE.list').fn.update(a.dataRow);
				}
			},
			tbar:[iif(_mobile,'<b>Template</b>',''),{xtype:'ibuttonnewtab'},{xtype:'ibuttonfullscreen'},{
				xtype:'iconfig',
				id:'TEMPLATE.config',
				menuCode:'TEMPLATE',
				code:[
					iif(_access('TEMPLATE_config_SEQUENCE')==false,'SEQUENCE',null),
					iif(_access('TEMPLATE_config_SEQUENCE_CODE')==false,'SEQUENCE_CODE',null),
				]
			},'->',
				{
					text: 'Tambah',
					tooltip:'Tambah <b>[F6]</b>',
					id:'TEMPLATE.btnAdd',
					iconCls:'fa fa-plus fa-green',
					handler:function(a){
						Ext.getCmp('TEMPLATE.input.panel').qReset();
						Ext.getCmp('TEMPLATE.input').closing = false;
						Ext.getCmp('TEMPLATE.list').hide();
						Ext.getCmp('TEMPLATE.input').show();
						if(getSetting('TEMPLATE','SEQUENCE')=='Y'){
							Ext.getCmp('TEMPLATE.input.f1').setReadOnly(true);
							Ext.getCmp('TEMPLATE.input.f2').focus();
						}else{
							Ext.getCmp('TEMPLATE.input.f1').setReadOnly(false);
							Ext.getCmp('TEMPLATE.input.f1').focus();
						}
						Ext.getCmp('TEMPLATE.input.p').setValue('ADD');
						Ext.getCmp('TEMPLATE.input.panel').qSetForm();
					}
				},{
					xtype:'buttongroup',
					hidden:_mobile,
					id:'TEMPLATE.group.search',
					items:[
						{
							xtype:'icombobox',
							id : 'TEMPLATE.dropdown',
							emptyText:'Pencarian',
							margin:false,
							value:'f2',
							data:[
								{id:'f1',text:'Kode Template'},
								{id:'f2',text:'Nama Template'},
								{id:'f3',text:'Deskripsi'},
							],
							width: 150,
							press:{
								enter:function(){
									_click('TEMPLATE.btnSearch');
								}
							}
						},{
							xtype:'itextfield',
							width: 200,
							emptyText:'Pencarian',
							margin:false,
							tooltip:'Pencarian [Ctrl+f]',
							id:'TEMPLATE.text',
							press:{
								enter:function(){
									_click('TEMPLATE.btnSearch');
								}
							}
						},{
							iconCls: 'fa fa-search',
							tooltip:'Pencarian',
							id:'TEMPLATE.btnSearch',
							handler : function(a) {
								Ext.getCmp('TEMPLATE.list').refresh(false);
							}
						}
					]
				},{
					tooltip:'Pencarian <b>[Ctrl+Shift+f]</b>',
					id:'TEMPLATE.btnShowSearch',
					iconCls: 'fa fa-filter',
					handler:function(a){
						Ext.getCmp('TEMPLATE.search').show();
						Ext.getCmp('TEMPLATE.search.f1').focus();
					}
				}
			],
			columns:[
				{ hidden: true, dataIndex: 'i' },
				{ text: 'Kode Template',width: 150, dataIndex: 'f1' },
				{ text: 'Nama Template',width: 200, dataIndex: 'f2' },
				{ text: 'Deskripsi',flex: 1, minWidth:200,dataIndex: 'f3' },
				{ xtype: 'active',dataIndex: 'f4'},
				{
					text: 'Edit',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-edit',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('TEMPLATE.list').fn.update(record.data);
					}
				},{
					text: 'Hapus',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-trash fa-red',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('TEMPLATE.list').fn.delete(record.data);
					}
				}
			]
		},{
			id:'TEMPLATE.input',
			border:false,
			hidden:true,
			layout:'fit',
			listeners:{
				show:function(){
					shortcut.set({
						code:'input',
						list:[
							{
								key:'ctrl+s',
								fn:function(){
									_click('TEMPLATE.input.btnSave');
								}
							},{
								key:'esc',
								fn:function(){
									_click('TEMPLATE.input.btnClose');
								}
							}
						]
					});
				},
				hide:function(){
					shortcut.remove('input');
				}
			},
			tbar: [
				{
					text: 'Kembali',
					tooltip:'Kembali <b>[Esc]</b>',
					id:'TEMPLATE.input.btnClose',
					iconCls:'fa fa-chevron-left fa-red',
					handler: function() {
						var req=Ext.getCmp('TEMPLATE.input.panel').qGetForm();
						if(req == false){
							Ext.getCmp('TEMPLATE.confirm').confirm({
								msg :'Apakah Akan Mengabaikan data Yang sudah Berubah ?',
								allow : 'TEMPLATE.close',
								onY : function() {
									Ext.getCmp('TEMPLATE.input').hide();
									Ext.getCmp('TEMPLATE.list').show();
								}
							});
						}else{
							Ext.getCmp('TEMPLATE.input').hide();
							Ext.getCmp('TEMPLATE.list').show();
						}
					}
				},'->','<b>Input Template</b>','->',{
					text: 'Simpan',
					tooltip:'Simpan <b>[Ctrl+s]</b>',
					id:'TEMPLATE.input.btnSave',
					iconCls:'fa fa-save fa-green',
					handler: function() {
						var req=Ext.getCmp('TEMPLATE.input.panel').qGetForm(true);
						if(req == false){
							var param = Ext.getCmp('TEMPLATE.input.panel').qParams();
							Ext.Ajax.request({
								url : url + 'cmd?m=TEMPLATE&f=save',
								method : 'POST',
								params:param,
								before:function(){
									Ext.getCmp('TEMPLATE.input').setLoading(true);
								},
								success : function(response) {
									Ext.getCmp('TEMPLATE.input').setLoading(false);
									var r = ajaxSuccess(response);
									if (r.r == 'S') {
										Ext.getCmp('TEMPLATE.list').refresh();
										Ext.getCmp('TEMPLATE.input.i').setValue(r.d.id);
										Ext.getCmp('TEMPLATE.input.f1').setValue(r.d.code);
										Ext.getCmp('TEMPLATE.input.p').setValue('UPDATE');
										Ext.getCmp('TEMPLATE.input.f5').setValue(r.d.text);
										Ext.getCmp('TEMPLATE.input.panel').qSetForm();
										Ext.getCmp('TEMPLATE.input.f1').setReadOnly(true);
									}
								},
								failure : function(jqXHR, exception) {
									Ext.getCmp('TEMPLATE.input').setLoading(false);
									ajaxError(jqXHR, exception);
								}
							});
						}else{
							if(Ext.getCmp('TEMPLATE.input.p').getValue()=='ADD'){
								Ext.create('IToast').toast({msg : 'Periksa Kembali Datanya.',type : 'warning'});
							}else{
								Ext.create('IToast').toast({msg : 'Tidak ada Perbubahan Data.',type : 'warning'});
							}
						}
					}
				}
			],
			items:[
				{
					xtype:'ipanel',
					id : 'TEMPLATE.input.panel',
					layout:{
						type:'vbox',
						align:'stretch'
					},
					paddingBottom:false,
					items:[
						{
							xtype:'panel',
							layout:'column',
							border:false,
							items:[
								{
									xtype:'form',
									border:false,
									columnWidth: .33,
									minWidth:350,
									items:[
										{
											xtype:'ihiddenfield',
											name:'p',
											id:'TEMPLATE.input.p'
										},{
											xtype:'ihiddenfield',
											name:'i',
											id:'TEMPLATE.input.i'
										},{
											xtype:'itextfield',
											maxLength:32,
											fieldLabel:'Code',
											name:'f1',
											property:{
												upper:true,
												space:false
											},
											id:'TEMPLATE.input.f1',
											allowBlank: false
										},{
											xtype:'itextfield',
											maxLength:64,
											property:{
												dynamic:true
											},
											fieldLabel:'Name',
											name:'f2',
											id:'TEMPLATE.input.f2',
											allowBlank: false
										},{
											xtype:'icheckbox',
											name:'f3',
											fieldLabel:'Aktif',
											id:'TEMPLATE.input.f3',
											checked:true
										}
									]
								},{
									xtype:'form',
									columnWidth: .33,
									border:false,
									minWidth:350,
									items:[
										{
											xtype:'itextarea',
											maxLength:256,
											fieldLabel:'Description',
											name:'f4',
											id:'TEMPLATE.input.f4',
										}
									]
								}
							]
						},{
							xtype:'ihtmleditor',
							id:'TEMPLATE.input.f5',
							name:'f5',
							minHeight: 400,
							flex:1,
						}
					]
				}
			]
		},{xtype:'iconfirm',id : 'TEMPLATE.confirm'}
	]
});