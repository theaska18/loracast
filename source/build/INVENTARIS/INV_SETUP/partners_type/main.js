/*
	import cmp.ipanel
	import cmp.itable
	import cmp.icombobox
	import cmp.itextarea
	import PARAMETER.iparameter
*/
shortcut.set({
	code:'main',
	list:[
		{
			key:'f5',
			fn:function(){
				Ext.getCmp('PARTNERS_TYPE.list').refresh();
			}
		},{
			key:'ctrl+f',
			fn:function(){
				Ext.getCmp('PARTNERS_TYPE.text').focus();
			}
		},{
			key:'ctrl+shift+f',
			fn:function(){
				_click('PARTNERS_TYPE.btnShowSearch');
			}
		},{
			key:'f6',
			fn:function(){
				_click('PARTNERS_TYPE.btnAdd');
			}
		}
	]
});
new Ext.Panel({
	id : 'PARTNERS_TYPE.main',
	layout:'fit',
	border:false,
	items : [
		{
			xtype:'iwindow',
			iconCls:'fa fa-search',
			id:'PARTNERS_TYPE.search',
			modal:false,
			title:'Jenis Rekan - Pencarian',
			listeners:{
				show:function(){
					shortcut.set({
						code:'search',
						list:[
							{
								key:'esc',
								fn:function(){
									_click('PARTNERS_TYPE.search.btnSearch');
								}
							},{
								key:'ctrl+r',
								fn:function(){
									_click('PARTNERS_TYPE.search.btnReset');
								}
							},{
								key:'ctrl+s',
								fn:function(){
									_click('PARTNERS_TYPE.search.btnSearch');
								}
							},{
								key:'ctrl+f',
								fn:function(){
									Ext.getCmp('PARTNERS_TYPE.search.f1').focus();
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
					id:'PARTNERS_TYPE.search.btnSearch',
					handler: function() {
						Ext.getCmp('PARTNERS_TYPE.list').refresh(true);
					}
				},{
					text: 'Reset',
					tooltip:'Reset <b>[Ctrl+r]</b>',
					iconCls:'fa fa-eraser fa-red',
					id:'PARTNERS_TYPE.search.btnReset',
					handler: function() {
						Ext.getCmp('PARTNERS_TYPE.search.panel').qReset();
					}
				},{
					text: 'Close',
					tooltip:'Close <b>[Esc]</b>',
					iconCls:'fa fa-close',
					handler: function() {
						Ext.getCmp('PARTNERS_TYPE.search').close();
					}
				}
			],
			items:[
				{
					xtype:'ipanel',
					id : 'PARTNERS_TYPE.search.panel',
					width: 350,
					items:[
						{
							xtype:'itextfield',
							name:'f1',
							fieldLabel:'Kode Jenis',
							press:{
								enter:function(){
									_click('PARTNERS_TYPE.search.btnSearch');
								}
							},
							id:'PARTNERS_TYPE.search.f1'
						},{
							xtype:'itextfield',
							name:'f2',
							fieldLabel:'Nama Jenis',
							press:{
								enter:function(){
									_click('PARTNERS_TYPE.search.btnSearch');
								}
							},
						},{
							xtype:'itextfield',
							name:'f3',
							fieldLabel:'Deskripsi',
							press:{
								enter:function(){
									_click('PARTNERS_TYPE.search.btnSearch');
								}
							},
							id:'PARTNERS_TYPE.search.f3'
						},{
							xtype:'iparameter',
							parameter:'ACTIVE_FLAG',
							name : 'f5',
							press:{
								enter:function(){
									_click('PARTNERS_TYPE.search.btnSearch');
								},
							},
							fieldLabel:'Izin'
						},{
							xtype:'iparameter',
							parameter:'ACTIVE_FLAG',
							name : 'f4',
							press:{
								enter:function(){
									_click('PARTNERS_TYPE.search.btnSearch');
								},
							},
							width: 200,
							fieldLabel:'Active'
						}
					]
				}
			]
		},{
			xtype:'itable',
			id:'PARTNERS_TYPE.list',
			params:function(bo){
				if(bo==true){
					return Ext.getCmp('PARTNERS_TYPE.search.panel').qParams();
				}else{
					var obj={};
					obj[Ext.getCmp('PARTNERS_TYPE.dropdown').getValue()]=Ext.getCmp('PARTNERS_TYPE.text').getValue();
					return obj;
				}
			},
			url:url + 'cmd?m=PARTNERS_TYPE&f=getList',
			result:function(response){
				return {list:response.d,total:response.t};
			},
			fn:{
				delete:function(a){
					_access('PARTNERS_TYPE_DELETE',function(){
						Ext.getCmp('PARTNERS_TYPE.confirm').confirm({
							msg : "Apakah akan hapus Kode Jenis '"+a.f1+"' ?",
							allow : 'PARTNERS_TYPE.delete',
							onY : function() {
								Ext.Ajax.request({
									url : url + 'cmd?m=PARTNERS_TYPE&f=delete',
									method : 'POST',
									params : {
										i : a.i
									},
									before:function(){
										Ext.getCmp('PARTNERS_TYPE.list').setLoading(true);
									},
									success : function(response) {
										Ext.getCmp('PARTNERS_TYPE.list').setLoading(false);
										var r = ajaxSuccess(response);
										if (r.r == 'S')
											Ext.getCmp('PARTNERS_TYPE.list').refresh();
									},
									failure : function(jqXHR, exception) {
										Ext.getCmp('PARTNERS_TYPE.list').setLoading(false);
										ajaxError(jqXHR, exception,true);
									}
								});
							}
						});
					});
				},
				update:function(a){
					_access('PARTNERS_TYPE_UPDATE',function(){
						Ext.Ajax.request({
							url : url + 'cmd?m=PARTNERS_TYPE&f=initUpdate',
							params:{i:a.i},
							method : 'GET',
							before:function(){
								Ext.getCmp('PARTNERS_TYPE.list').setLoading(true);
							},
							success : function(response) {
								Ext.getCmp('PARTNERS_TYPE.list').setLoading(false);
								var r = ajaxSuccess(response);
								if (r.r == 'S') {
									var o=r.d.o;
									Ext.getCmp('PARTNERS_TYPE.input.panel').qReset();
									Ext.getCmp('PARTNERS_TYPE.input.f1').setReadOnly(true);
									Ext.getCmp('PARTNERS_TYPE.input.f1').setValue(a.f1);
									Ext.getCmp('PARTNERS_TYPE.input.f2').setValue(a.f2);
									Ext.getCmp('PARTNERS_TYPE.input.f3').setValue(o.f3);
									Ext.getCmp('PARTNERS_TYPE.input.f4').setValue(o.f4);
									Ext.getCmp('PARTNERS_TYPE.input.f5').setValue(o.f5);
									// Ext.getCmp('PARTNERS_TYPE.input.f6').setValue(o.f6);
									Ext.getCmp('PARTNERS_TYPE.input.i').setValue(a.i);
									Ext.getCmp('PARTNERS_TYPE.input.p').setValue('UPDATE');
									Ext.getCmp('PARTNERS_TYPE.list').hide();
									Ext.getCmp('PARTNERS_TYPE.input').show();
									Ext.getCmp('PARTNERS_TYPE.input.f2').focus();
									Ext.getCmp('PARTNERS_TYPE.input.panel').qSetForm()
								}
							},
							failure : function(jqXHR, exception) {
								Ext.getCmp('PARTNERS_TYPE.list').setLoading(false);
								ajaxError(jqXHR, exception,true);
							}
						});
					});
				}
			},
			press:{
				delete:function(a){
					Ext.getCmp('PARTNERS_TYPE.list').fn.delete(a.dataRow);
				},
				enter:function(a){
					Ext.getCmp('PARTNERS_TYPE.list').fn.update(a.dataRow);
				}
			},
			tbar:[iif(_mobile,'<b>Jenis Rekanan</b>',''),{xtype:'ibuttonnewtab'},{xtype:'ibuttonfullscreen'},{
				xtype:'iconfig',
				id:'PARTNERS_TYPE.config',
				menuCode:'PARTNERS_TYPE',
				code:[
					iif(_access('PARTNERS_TYPE_config_SEQUENCE')==false,'SEQUENCE',null),
					iif(_access('PARTNERS_TYPE_config_SEQUENCE_CODE')==false,'SEQUENCE_CODE',null)
				]
			},'->',{
					text:'Tambah',
					tooltip:'Tambah <b>[F6]</b>',
					id:'PARTNERS_TYPE.btnAdd',
					iconCls: 'fa fa-plus fa-green',
					handler:function(a){
						Ext.getCmp('PARTNERS_TYPE.input.panel').qReset();
						Ext.getCmp('PARTNERS_TYPE.input.f1').setReadOnly(false);
						Ext.getCmp('PARTNERS_TYPE.input.p').setValue('ADD');
						Ext.getCmp('PARTNERS_TYPE.list').hide();
						Ext.getCmp('PARTNERS_TYPE.input').show();
						if(getSetting('PARTNERS_TYPE','SEQUENCE')=='Y'){
							Ext.getCmp('PARTNERS_TYPE.input.f1').setReadOnly(true);
							Ext.getCmp('PARTNERS_TYPE.input.f2').focus();
						}else{
							Ext.getCmp('PARTNERS_TYPE.input.f1').setReadOnly(false);
							Ext.getCmp('PARTNERS_TYPE.input.f1').focus();
						}
						Ext.getCmp('PARTNERS_TYPE.input.panel').qSetForm();
					}
				},{
					xtype:'buttongroup',
					id:'PARTNERS_TYPE.group.search',
					hidden:_mobile,
					items:[
						{
							xtype:'icombobox',
							id : 'PARTNERS_TYPE.dropdown',
							emptyText:'Pencarian',
							margin:false,
							value:'f2',
							data:[
								{id:'f2',text:'Nama Jenis'},
								{id:'f1',text:'Kode Jenis'},
								{id:'f3',text:'Deskripsi'},
							],
							width: 150,
							press:{
								enter:function(){
									_click('PARTNERS_TYPE.btnSearch');
								}
							}
						},{
							xtype:'itextfield',
							width: 200,
							emptyText:'Pencarian',
							margin:false,
							tooltip:'Pencarian [Ctrl+f]',
							id:'PARTNERS_TYPE.text',
							press:{
								enter:function(){
									_click('PARTNERS_TYPE.btnSearch');
								}
							}
						},{
							iconCls: 'fa fa-search',
							tooltip:'Pencarian [F5]',
							id:'PARTNERS_TYPE.btnSearch',
							handler : function(a) {
								Ext.getCmp('PARTNERS_TYPE.list').refresh(false);
							}
						}
					]
				},{
					tooltip:'Pencarian <b>[Ctrl+Shift+f]</b>',
					id:'PARTNERS_TYPE.btnShowSearch',
					iconCls: 'fa fa-filter',
					handler:function(a){
						Ext.getCmp('PARTNERS_TYPE.search').show();
						Ext.getCmp('PARTNERS_TYPE.search.f1').focus();
					}
				}
			],
			columns:[
				{ xtype: 'rownumberer'},
				{ hidden:true,dataIndex: 'i' },
				{ text: 'Kode Jenis',width: 120, dataIndex: 'f1' },
				{ text: 'Nama Jenis',width: 200,dataIndex: 'f2'},
				{ text: 'Deskripsi',flex: true,dataIndex: 'f3' },
				{ xtype: 'active',dataIndex: 'f4'},{
					text: 'Edit',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-edit',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('PARTNERS_TYPE.list').fn.update(record.data);
					}
				},{
					text: 'Hapus',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-trash fa-red',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('PARTNERS_TYPE.list').fn.delete(record.data);
					}
				}
				
			]
		},{
			id:'PARTNERS_TYPE.input',
			border:false,
			hidden:true,
			listeners:{
				show:function(){
					shortcut.set({
						code:'input',
						list:[
							{
								key:'ctrl+s',
								fn:function(){
									_click('PARTNERS_TYPE.input.btnSave');
								}
							},{
								key:'esc',
								fn:function(){
									_click('PARTNERS_TYPE.input.btnClose');
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
					id:'PARTNERS_TYPE.input.btnClose',
					iconCls:'fa fa-chevron-left fa-red',
					handler: function() {
						var req=Ext.getCmp('PARTNERS_TYPE.input.panel').qGetForm();
						if(req == false){
							Ext.getCmp('PARTNERS_TYPE.confirm').confirm({
								msg :'Apakah Akan Mengabaikan data Yang sudah Berubah ?',
								allow : 'PARTNERS_TYPE.close',
								onY : function() {
									Ext.getCmp('PARTNERS_TYPE.input').hide();
									Ext.getCmp('PARTNERS_TYPE.list').show();
								}
							});
						}else{
							Ext.getCmp('PARTNERS_TYPE.input').hide();
							Ext.getCmp('PARTNERS_TYPE.list').show();
						}
					}
				},'->','<b>Input Jenis Rekanan</b>','->',{
					text: 'Simpan',
					tooltip:'Simpan <b>[Ctrl+s]</b>',
					id:'PARTNERS_TYPE.input.btnSave',
					iconCls:'fa fa-save fa-green',
					handler: function() {
						var req=Ext.getCmp('PARTNERS_TYPE.input.panel').qGetForm(true);
						if(req == false)
							Ext.getCmp('PARTNERS_TYPE.confirm').confirm({
								msg : 'Apakah akan menyimpan data ini?',
								allow : 'PARTNERS_TYPE.save',
								onY : function() {
									var param = Ext.getCmp('PARTNERS_TYPE.input.panel').qParams();
									Ext.Ajax.request({
										url : url + 'cmd?m=PARTNERS_TYPE&f=save',
										method : 'POST',
										params:param,
										before:function(){
											Ext.getCmp('PARTNERS_TYPE.input').setLoading(true);
										},
										success : function(response) {
											Ext.getCmp('PARTNERS_TYPE.input').setLoading(false);
											var r = ajaxSuccess(response);
											if (r.r == 'S') {
												Ext.getCmp('PARTNERS_TYPE.input').hide();
												Ext.getCmp('PARTNERS_TYPE.list').show();
												Ext.getCmp('PARTNERS_TYPE.list').refresh();
											}
										},
										failure : function(jqXHR, exception) {
											Ext.getCmp('PARTNERS_TYPE.input').setLoading(false);
											ajaxError(jqXHR, exception,true);
										}
									});
								}
							});
						else if(req==true){
							Ext.getCmp('PARTNERS_TYPE.input').hide();
							Ext.getCmp('PARTNERS_TYPE.list').show();
						}
					}
				}
			],
			items:[
				{
					xtype:'ipanel',
					id : 'PARTNERS_TYPE.input.panel',
					width: 350,
					submit:'PARTNERS_TYPE.input.btnSave',
					items:[
						{
							xtype:'ihiddenfield',
							name:'p',
							id:'PARTNERS_TYPE.input.p'
						},{
							xtype:'ihiddenfield',
							name:'i',
							id:'PARTNERS_TYPE.input.i'
						},{
							xtype:'itextfield',
							submit:'PARTNERS_TYPE.input.panel',
							maxLength:32,
							fieldLabel:'Kode Jenis',
							name:'f1',
							property:{
								upper:true,
								space:false
							},
							id:'PARTNERS_TYPE.input.f1',
							allowBlank: false
						},{
							xtype:'itextfield',
							name:'f2',
							maxLength:64,
							submit:'PARTNERS_TYPE.input.panel',
							fieldLabel:'Nama Jenis',
							property:{
								dynamic:true
							},
							id:'PARTNERS_TYPE.input.f2',
							allowBlank: false
						},{
							xtype:'itextarea',
							name:'f3',
							submit:'PARTNERS_TYPE.input.panel',
							fieldLabel:'Deskripsi',
							id:'PARTNERS_TYPE.input.f3',
							maxLength:128,
						},{
							xtype:'icheckbox',
							name:'f5',
							submit:'PARTNERS_TYPE.input.panel',
							fieldLabel:'Izin',
							id:'PARTNERS_TYPE.input.f5',
							checked:false
						},{
							xtype:'icheckbox',
							name:'f4',
							submit:'PARTNERS_TYPE.input.panel',
							fieldLabel:'Aktif',
							id:'PARTNERS_TYPE.input.f4',
							checked:true
						}
					]
				}
			],
			qBeforeClose : function() {
				var $this = this;
				$this.closing = false;
				if (Ext.getCmp('PARTNERS_TYPE.input.panel').qGetForm() == false)
					Ext.getCmp('PARTNERS_TYPE.confirm').confirm({
						msg :'Apakah akan mengabaikan data yang telah diubah?',
						allow : 'PARTNERS_TYPE.close',
						onY : function() {
							$this.qClose();
						}
					});
				else
					$this.qClose();
				return false;
			}
		},{xtype:'iconfirm',id : 'PARTNERS_TYPE.confirm'}
	]
});