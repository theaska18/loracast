/*
	import cmp.ipanel
	import PARAMETER.iparameter
	import cmp.icombobox
	import cmp.iconfig
	import cmp.itable
*/
shortcut.set({
	code:'main',
	list:[
		{
			key:'f5',
			fn:function(){
				Ext.getCmp('FACTORY.list').refresh();
			}
		},{
			key:'ctrl+f',
			fn:function(){
				Ext.getCmp('FACTORY.text').focus();
			}
		},{
			key:'ctrl+shift+f',
			fn:function(){
				_click('FACTORY.btnShowSearch');
			}
		},{
			key:'f6',
			fn:function(){
				_click('FACTORY.btnAdd');
			}
		}
	]
});
new Ext.Panel({
	id : 'FACTORY.main',
	layout:'fit',
	border:false,
	items : [
		{
			xtype:'iwindow',
			iconCls:'fa fa-search',
			id:'FACTORY.search',
			modal:false,
			title:'Pabrik - Pencarian',
			listeners:{
				show:function(){
					shortcut.set({
						code:'search',
						list:[
							{
								key:'esc',
								fn:function(){
									_click('FACTORY.search.btnSearch');
								}
							},{
								key:'ctrl+r',
								fn:function(){
									_click('FACTORY.search.btnReset');
								}
							},{
								key:'ctrl+s',
								fn:function(){
									_click('FACTORY.search.btnSearch');
								}
							},{
								key:'ctrl+f',
								fn:function(){
									Ext.getCmp('FACTORY.search.f1').focus();
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
					id:'FACTORY.search.btnSearch',
					handler: function() {
						Ext.getCmp('FACTORY.list').refresh(true);
					}
				},{
					text: 'Reset',
					tooltip:'Reset <b>[Ctrl+r]</b>',
					iconCls:'fa fa-eraser fa-red',
					id:'FACTORY.search.btnReset',
					handler: function() {
						Ext.getCmp('FACTORY.search.panel').qReset();
					}
				},{
					text: 'Close',
					tooltip:'Close <b>[Esc]</b>',
					iconCls:'fa fa-close',
					handler: function() {
						Ext.getCmp('FACTORY.search').close();
					}
				}
			],
			items:[
				{
					xtype:'ipanel',
					id : 'FACTORY.search.panel',
					width: 350,
					items:[
						{
							xtype:'itextfield',
							name:'f1',
							fieldLabel:'Kode Pabrik',
							press:{
								enter:function(){
									_click('FACTORY.search.btnSearch');
								}
							},
							id:'FACTORY.search.f1'
						},{
							xtype:'itextfield',
							name:'f2',
							fieldLabel:'Nama Pabrik',
							press:{
								enter:function(){
									_click('FACTORY.search.btnSearch');
								}
							}
						},{
							xtype:'iparameter',
							parameter:'ACTIVE_FLAG',
							name : 'f3',
							press:{
								enter:function(){
									_click('FACTORY.search.btnSearch');
								},
							},
							width: 200,
							fieldLabel:'Aktif'
						}
					]
				}
			]
		},{
			xtype:'itable',
			id:'FACTORY.list',
			params:function(bo){
				if(bo==true){
					return Ext.getCmp('FACTORY.search.panel').qParams();
				}else{
					var obj={};
					obj[Ext.getCmp('FACTORY.dropdown').getValue()]=Ext.getCmp('FACTORY.text').getValue();
					return obj;
				}
			},
			url:url + 'cmd?m=FACTORY&f=getList',
			result:function(response){
				return {list:response.d,total:response.t};
			},
			fn:{
				delete:function(a){
					_access('FACTORY_DELETE',function(){
						Ext.getCmp('FACTORY.confirm').confirm({
							msg : "Apakah akan hapus Kode Pabrik '"+a.f1 +"'",
							allow : 'FACTORY.delete',
							onY : function() {
								Ext.Ajax.request({
									url : url + 'cmd?m=FACTORY&f=delete',
									method : 'POST',
									params : {
										i : a.i
									},
									before:function(){
										Ext.getCmp('FACTORY.list').setLoading(true);
									},
									success : function(response) {
										Ext.getCmp('FACTORY.list').setLoading(false);
										var r = ajaxSuccess(response);
										if (r.r == 'S')
											Ext.getCmp('FACTORY.list').refresh();
									},
									failure : function(jqXHR, exception) {
										Ext.getCmp('FACTORY.list').setLoading(false);
										ajaxError(jqXHR, exception,true);
									}
								});
							}
						});
					});
				},
				update:function(a){
					_access('FACTORY_UPDATE',function(){
						Ext.Ajax.request({
							url : url + 'cmd?m=FACTORY&f=initUpdate',
							params:{i:a.i},
							method : 'GET',
							before:function(){
								Ext.getCmp('FACTORY.list').setLoading(true);
							},
							success : function(response) {
								Ext.getCmp('FACTORY.list').setLoading(false);
								var r = ajaxSuccess(response);
								if (r.r == 'S') {
									var o=r.d.o;
									Ext.getCmp('FACTORY.input.panel').qReset();
									Ext.getCmp('FACTORY.input.f1').setValue(a.f1);
									Ext.getCmp('FACTORY.input.f2').setValue(a.f2);
									Ext.getCmp('FACTORY.input.f3').setValue(o.f3);
									Ext.getCmp('FACTORY.input.i').setValue(a.i);
									Ext.getCmp('FACTORY.input.p').setValue('UPDATE');
									Ext.getCmp('FACTORY.list').hide();
									Ext.getCmp('FACTORY.input').show();
									Ext.getCmp('FACTORY.input.f2').focus();
									Ext.getCmp('FACTORY.input.panel').qSetForm()
								}
							},
							failure : function(jqXHR, exception) {
								Ext.getCmp('FACTORY.list').setLoading(false);
								ajaxError(jqXHR, exception,true);
							}
						});
					});
				}
			},
			press:{
				delete:function(a){
					Ext.getCmp('FACTORY.list').fn.delete(a.dataRow);
				},
				enter:function(a){
					Ext.getCmp('FACTORY.list').fn.update(a.dataRow);
				}
			},
			tbar:[iif(_mobile,'<b>Pabrik</b>',''),{xtype:'ibuttonnewtab'},{xtype:'ibuttonfullscreen'},{
					xtype:'iconfig',
					id:'FACTORY.config',
					menuCode:'FACTORY',
					code:[
						iif(_access('FACTORY_config_SEQUENCE')==false,'SEQUENCE',null),
						iif(_access('FACTORY_config_SEQUENCE_CODE')==false,'SEQUENCE_CODE',null)
					]
				},'->',{
					text: 'Tambah',
					tooltip:'Tambah <b>[F6]</b>',
					id:'FACTORY.btnAdd',
					iconCls: 'fa fa-plus fa-green',
					handler:function(a){
						Ext.getCmp('FACTORY.input.panel').qReset();
						Ext.getCmp('FACTORY.input.p').setValue('ADD');
						Ext.getCmp('FACTORY.list').hide();
						Ext.getCmp('FACTORY.input').show();
						if(getSetting('FACTORY','SEQUENCE')=='Y'){
							Ext.getCmp('FACTORY.input.f1').setReadOnly(true);
							Ext.getCmp('FACTORY.input.f2').focus();
						}else{
							Ext.getCmp('FACTORY.input.f1').setReadOnly(false);
							Ext.getCmp('FACTORY.input.f1').focus();
						}
						Ext.getCmp('FACTORY.input.panel').qSetForm();
					}
				},{
					xtype:'buttongroup',
					id:'FACTORY.group.search',
					hidden:_mobile,
					items:[
						{
							xtype:'icombobox',
							id : 'FACTORY.dropdown',
							emptyText:'Pencarian',
							margin:false,
							value:'f2',
							data:[
								{id:'f2',text:'Nama Pabrik'},
								{id:'f1',text:'Kode Pabrik'}
							],
							width: 150,
							press:{
								enter:function(){
									_click('FACTORY.btnSearch');
								}
							}
						},{
							xtype:'itextfield',
							width: 200,
							emptyText:'Pencarian',
							margin:false,
							tooltip:'Pencarian [Ctrl+f]',
							id:'FACTORY.text',
							press:{
								enter:function(){
									_click('FACTORY.btnSearch');
								}
							}
						},{
							iconCls: 'fa fa-search',
							tooltip:'Pencarian [F5]',
							id:'FACTORY.btnSearch',
							handler : function(a) {
								Ext.getCmp('FACTORY.list').refresh(false);
							}
						}
					]
				},{
					tooltip:'Pencarian <b>[Ctrl+Shift+f]</b>',
					id:'FACTORY.btnShowSearch',
					iconCls: 'fa fa-filter',
					handler:function(a){
						Ext.getCmp('FACTORY.search').show();
						Ext.getCmp('FACTORY.search.f1').focus();
					}
				}
			],
			columns:[
				{ xtype: 'rownumberer'},
				{ hidden:true,dataIndex: 'i' },
				{ text: 'Kode Pabrik',width: 120, dataIndex: 'f1' },
				{ text: 'Nama Pabrik',flex:true,dataIndex: 'f2'},
				{ xtype:'active',dataIndex: 'f3'},
				{
					text: 'Edit',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-edit',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('FACTORY.list').fn.update(record.data);
					}
				},{
					text: 'Hapus',
					xtype: 'actioncolumn',
					iconCls: 'fa fa-trash fa-red',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('FACTORY.list').fn.delete(record.data);
					}
				}
				
			]
		},{
			id:'FACTORY.input',
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
									_click('FACTORY.input.btnSave');
								}
							},{
								key:'esc',
								fn:function(){
									_click('FACTORY.input.btnClose');
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
					tooltip:'Close <b>[Esc]</b>',
					id:'FACTORY.input.btnClose',
					iconCls:'fa fa-chevron-left fa-red',
					handler: function() {
						var req=Ext.getCmp('FACTORY.input.panel').qGetForm();
						if(req == false){
							Ext.getCmp('FACTORY.confirm').confirm({
								msg :'Apakah Akan Mengabaikan data Yang sudah Berubah ?',
								allow : 'FACTORY.close',
								onY : function() {
									Ext.getCmp('FACTORY.input').hide();
									Ext.getCmp('FACTORY.list').show();
								}
							});
						}else{
							Ext.getCmp('FACTORY.input').hide();
							Ext.getCmp('FACTORY.list').show();
						}
					}
				},'->','<b>Input Pabrik</b>','->',{
					text: 'Simpan',
					tooltip:'Simpan <b>[Ctrl+s]</b>',
					id:'FACTORY.input.btnSave',
					iconCls:'fa fa-save fa-green',
					handler: function() {
						var req=Ext.getCmp('FACTORY.input.panel').qGetForm(true);
						if(req == false)
							Ext.getCmp('FACTORY.confirm').confirm({
								msg : 'Apakah akan menyimpan data ini?',
								allow : 'FACTORY.save',
								onY : function() {
									var param = Ext.getCmp('FACTORY.input.panel').qParams();
									Ext.Ajax.request({
										url : url + 'cmd?m=FACTORY&f=save',
										method : 'POST',
										params:param,
										before:function(){
											Ext.getCmp('FACTORY.input').setLoading(true);
										},
										success : function(response) {
											Ext.getCmp('FACTORY.input').setLoading(false);
											var r = ajaxSuccess(response);
											if (r.r == 'S') {
												Ext.getCmp('FACTORY.input.p').setValue('UPDATE');
												if(r.d.i!=''){
													Ext.getCmp('FACTORY.input.i').setValue(r.d.i);
													Ext.getCmp('FACTORY.input.f1').setValue(r.d.f1);
												}
												Ext.getCmp('FACTORY.input.f1').setReadOnly(true);
												Ext.getCmp('FACTORY.input.f2').focus();
												Ext.getCmp('FACTORY.input.panel').qSetForm()
												Ext.getCmp('FACTORY.list').refresh();
											}
										},
										failure : function(jqXHR, exception) {
											Ext.getCmp('FACTORY.input').setLoading(false);
											ajaxError(jqXHR, exception,true);
										}
									});
								}
							});
						else if(req==true){
							Ext.getCmp('FACTORY.input').hide();
							Ext.getCmp('FACTORY.list').show();
						}
					}
				}
			],
			items:[
				{
					xtype:'ipanel',
					submit:'FACTORY.input.btnSave',
					id : 'FACTORY.input.panel',
					width: 350,
					items:[
						{
							xtype:'ihiddenfield',
							name:'p',
							id:'FACTORY.input.p'
						},{
							xtype:'ihiddenfield',
							name:'i',
							id:'FACTORY.input.i'
						},{
							xtype:'itextfield',
							submit:'FACTORY.input.panel',
							maxLength:32,
							fieldLabel:'Kode Pabrik',
							name:'f1',
							readOnly:true,
							property:{
								upper:true,
								space:false
							},
							id:'FACTORY.input.f1',
							allowBlank: false
						},{
							xtype:'itextfield',
							submit:'FACTORY.input.panel',
							name:'f2',
							fieldLabel:'Nama Pabrik',
							property:{
								dynamic:true
							},
							id:'FACTORY.input.f2',
							allowBlank: false
						},{
							xtype:'icheckbox',
							submit:'FACTORY.input.panel',
							name:'f3',
							fieldLabel:'Aktif',
							id:'FACTORY.input.f3',
							checked:true
						}
					]
				}
			],
			qBeforeClose : function() {
				var $this = this;
				$this.closing = false;
				if (Ext.getCmp('FACTORY.input.panel').qGetForm() == false)
					Ext.getCmp('FACTORY.confirm').confirm({
						msg :'Apakah akan mengabaikan data yang sudah diubah?',
						allow : 'FACTORY.close',
						onY : function() {
							$this.qClose();
						}
					});
				else
					$this.qClose();
				return false;
			}
		},
		{xtype:'iconfirm',id : 'FACTORY.confirm'}
	]
});