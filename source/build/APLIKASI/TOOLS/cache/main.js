/*
	import PARAMETER.iparameter
	import cmp.icombobox
	import cmp.itable
	import cmp.ipanel
	import cmp.itextarea
	import cmp.iinput
*/
shortcut.set({
	code:'main',
	list:[
		{
			key:'f5',
			fn:function(){
				Ext.getCmp('CACHE.list').refresh();
			}
		},{
			key:'ctrl+f',
			fn:function(){
				Ext.getCmp('CACHE.text').focus();
			}
		},{
			key:'ctrl+shift+f',
			fn:function(){
				_click('CACHE.btnShowSearch');
			}
		},{
			key:'f6',
			fn:function(){
				_click('CACHE.btnAdd');
			}
		}
	]
});
new Ext.Panel({
	id : 'CACHE.main',
	layout:'fit',
	border:false,
	items : [
		{
			xtype:'iwindow',
			iconCls:'fa fa-search',
			id:'CACHE.search',
			modal:false,
			title:'Cache - Pencarian',
			listeners:{
				show:function(){
					shortcut.set({
						code:'search',
						list:[
							{
								key:'esc',
								fn:function(){
									_click('CACHE.search.btnSearch');
								}
							},{
								key:'ctrl+r',
								fn:function(){
									_click('CACHE.search.btnReset');
								}
							},{
								key:'ctrl+s',
								fn:function(){
									_click('CACHE.search.btnSearch');
								}
							},{
								key:'ctrl+f',
								fn:function(){
									Ext.getCmp('CACHE.search.f1').focus();
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
					tooltip:'Caari <b>[Ctrl+s]</b>',
					iconCls:'fa fa-search fa-green',
					id:'CACHE.search.btnSearch',
					handler: function() {
						Ext.getCmp('CACHE.list').refresh(true);
					}
				},{
					text: 'Reset',
					tooltip:'Reset <b>[Ctrl+r]</b>',
					iconCls:'fa fa-eraser fa-red',
					id:'CACHE.search.btnReset',
					handler: function() {
						Ext.getCmp('CACHE.search.panel').qReset();
					}
				},{
					text:'Keluar',
					tooltip:'Keluar <b>[Esc]</b>',
					iconCls:'fa fa-close',
					handler: function() {
						Ext.getCmp('CACHE.search').close();
					}
				}
			],
			items:[
				{
					xtype:'ipanel',
					id : 'CACHE.search.panel',
					width: 350,
					items:[
						{
							xtype:'itextfield',
							name:'f1',
							fieldLabel:'Kode Cache',
							press:{
								enter:function(){
									_click('CACHE.search.btnSearch');
								}
							},
							id:'CACHE.search.f1'
						},{
							xtype:'itextfield',
							name:'f2',
							fieldLabel:'Nama Cache',
							press:{
								enter:function(){
									_click('CACHE.search.btnSearch');
								}
							}
						},{
							xtype:'itextfield',
							name:'f3',
							id:'CACHE.search.f3',
							fieldLabel:'Deskripsi',
							press:{
								enter:function(){
									_click('CACHE.search.btnSearch');
								}
							}
						},{
							xtype:'iparameter',
							parameter:'ACTIVE_FLAG',
							name : 'f4',
							width: 200,
							press:{
								enter:function(){
									_click('CACHE.search.btnSearch');
								},
							},
							fieldLabel:'Aktif'
						},{
							xtype:'iparameter',
							parameter:'ACTIVE_FLAG',
							name : 'f4',
							width: 200,
							press:{
								enter:function(){
									_click('CACHE.search.btnSearch');
								},
							},
							fieldLabel:'Sistem'
						}
					]
				}
			]
		},{
			xtype:'itable',
			id:'CACHE.list',
			params:function(bo){
				if(bo==true){
					return Ext.getCmp('CACHE.search.panel').qParams();
				}else{
					var obj={};
					obj[Ext.getCmp('CACHE.dropdown').getValue()]=Ext.getCmp('CACHE.text').getValue();
					return obj;
				}
			},
			url:url + 'cmd?m=CACHE&f=getList',
			result:function(response){
				return {list:response.d,total:response.t};
			},
			fn:{
				delete:function(a){
					_access('CACHE_DELETE',function(){
						Ext.getCmp('CACHE.confirm').confirm({
							msg :'Are you sure delete Group Code '+a.f1,
							allow : 'CACHE.delete',
							onY : function() {
								Ext.Ajax.request({
									url : url + 'cmd?m=CACHE&f=delete',
									method : 'POST',
									params : {
										i : a.i
									},
									before:function(){
										Ext.getCmp('CACHE.list').setLoading(true);
									},
									success : function(response) {
										Ext.getCmp('CACHE.list').setLoading(false);
										var r = ajaxSuccess(response);
										if (r.r == 'S')
											Ext.getCmp('CACHE.list').refresh();
									},
									failure : function(jqXHR, exception) {
										Ext.getCmp('CACHE.list').setLoading(false);
										ajaxError(jqXHR, exception,true);
									}
								});
							}
						});
					});
				},
				update:function(a){
					_access('CACHE_UPDATE',function(){
						Ext.Ajax.request({
							url : url + 'cmd?m=CACHE&f=initUpdate',
							params:{i:a.i},
							method : 'GET',
							before:function(){
								Ext.getCmp('CACHE.list').setLoading(true);
							},
							success : function(response) {
								Ext.getCmp('CACHE.list').setLoading(false);
								var r = ajaxSuccess(response);
								if (r.r == 'S') {
									var o=r.d.o;
									Ext.getCmp('CACHE.input.panel').qReset();
									Ext.getCmp('CACHE.input.f1').setReadOnly(true);
									Ext.getCmp('CACHE.input.f1').setValue(a.f1);
									Ext.getCmp('CACHE.input.f2').setValue(a.f2);
									Ext.getCmp('CACHE.input.f3').setValue(a.f3);
									Ext.getCmp('CACHE.input.f4').setValue(o.f4);
									Ext.getCmp('CACHE.input.f5').setValue(o.f5);
									Ext.getCmp('CACHE.input.f7').setValue(o.f7);
									Ext.getCmp('CACHE.input.i').setValue(a.i);
									Ext.getCmp('CACHE.input.p').setValue('UPDATE');
									Ext.getCmp('CACHE.input').closing = false;
									
									// Ext.getCmp('CACHE.input').setTitle('Menu Group - Update');
									Ext.getCmp('CACHE.list').hide();
									Ext.getCmp('CACHE.input').show();
									//Ext.getCmp('CACHE.input.html').toEditor();
									Ext.getCmp('CACHE.input.f2').focus();
									Ext.getCmp('CACHE.input.panel').qSetForm()
								}
							},
							failure : function(jqXHR, exception) {
								Ext.getCmp('CACHE.list').setLoading(false);
								ajaxError(jqXHR, exception,true);
							}
						});
					});
					
				}
			},
			press:{
				delete:function(a){
					Ext.getCmp('CACHE.list').fn.delete(a.dataRow);
				},
				enter:function(a){
					Ext.getCmp('CACHE.list').fn.update(a.dataRow);
				}
			},
			tbar:[iif(_mobile,'<b>Cache</b>',''),{xtype:'ibuttonnewtab'},{xtype:'ibuttonfullscreen'},'->',
				{
					text: 'Tambah',
					tooltip:'Tambah <b>[F6]</b>',
					id:'CACHE.btnAdd',
					iconCls: 'fa fa-plus fa-green',
					handler:function(a){
						Ext.getCmp('CACHE.input.panel').qReset();
						Ext.getCmp('CACHE.input.f1').setReadOnly(false);
						Ext.getCmp('CACHE.input.p').setValue('ADD');
						Ext.getCmp('CACHE.input').closing = false;
						Ext.getCmp('CACHE.list').hide();
						Ext.getCmp('CACHE.input').show();
						//Ext.getCmp('CACHE.input.html').toEditor();
						
						// Ext.getCmp('CACHE.input').setTitle('Cahce - Tambah');
						Ext.getCmp('CACHE.input.f1').focus();
						Ext.getCmp('CACHE.input.panel').qSetForm();
					}
				},{
					xtype:'buttongroup',
					id:'CACHE.group.search',
					hidden:_mobile,
					items:[
						{
							xtype:'icombobox',
							id : 'CACHE.dropdown',
							emptyText:'Searching',
							margin:false,
							value:'f2',
							data:[
								{id:'f2',text:'Nama Cache'},
								{id:'f1',text:'Kode Cache'},
								{id:'f3',text:'Description'},
							],
							width: 150,
							press:{
								enter:function(){
									_click('CACHE.btnSearch');
								}
							}
						},{
							xtype:'itextfield',
							width: 200,
							emptyText:'Pencarian',
							margin:false,
							tooltip:'Pencarian [Ctrl+f]',
							id:'CACHE.text',
							press:{
								enter:function(){
									_click('CACHE.btnSearch');
								}
							}
						},{
							iconCls: 'fa fa-search',
							tooltip:'Pencarian',
							id:'CACHE.btnSearch',
							handler : function(a) {
								Ext.getCmp('CACHE.list').refresh(false);
							}
						}
					]
				},{
					tooltip:'Pencarian <b>[Ctrl+Shift+f]</b>',
					id:'CACHE.btnShowSearch',
					iconCls: 'fa fa-filter',
					handler:function(a){
						Ext.getCmp('CACHE.search').show();
						Ext.getCmp('CACHE.search.f1').focus();
					}
				}
			],
			columns:[
				{ xtype: 'rownumberer'},
				{ hidden:true,hideable:false,dataIndex: 'i' },
				{ text: 'Kode Cache',width: 120, dataIndex: 'f1' },
				{ text: 'Nama Cache',width: 200,dataIndex: 'f2'},
				{ text: 'Deskripsi',flex: true,minWidth: 200,dataIndex: 'f3' },
				{ xtype:'active',text:'Sistem',dataIndex: 'f4'},
				{ xtype:'active',dataIndex: 'f5'},
				{
					text: 'Edit',
					xtype: 'actioncolumn',
					iconCls:'fa fa-edit',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('CACHE.list').fn.update(record.data);
					}
				},{
					text: 'Hapus',
					xtype: 'actioncolumn',
					iconCls:'fa fa-trash fa-red',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('CACHE.list').fn.delete(record.data);
					}
				}
				
			]
		},{
			id:'CACHE.input',
			// title:'Cache',
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
									_click('CACHE.input.btnSave');
								}
							},{
								key:'esc',
								fn:function(){
									_click('CACHE.input.btnClose');
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
					id:'CACHE.input.btnClose',
					iconCls:'fa fa-chevron-left fa-red',
					handler: function() {
						var req=Ext.getCmp('CACHE.input.panel').qGetForm();
						if(req == false){
							Ext.getCmp('CACHE.confirm').confirm({
								msg :'Apakah Akan Mengabaikan data Yang sudah Berubah ?',
								allow : 'CACHE.close',
								onY : function() {
									Ext.getCmp('CACHE.input').hide();
									Ext.getCmp('CACHE.list').show();
								}
							});
						}else{
							Ext.getCmp('CACHE.input').hide();
							Ext.getCmp('CACHE.list').show();
						}
					}
				},'->','<b>Input Cache</b>','->',{
					text: 'Simpan',
					tooltip:'Simpan <b>[Ctrl+s]</b>',
					id:'CACHE.input.btnSave',
					iconCls:'fa fa-save fa-green',
					handler: function() {
						var req=Ext.getCmp('CACHE.input.panel').qGetForm(true);
						if(req == false)
							Ext.getCmp('CACHE.confirm').confirm({
								msg : 'Apakah akan menyimpan data ini?',
								allow : 'CACHE.save',
								onY : function() {
									var param = Ext.getCmp('CACHE.input.panel').qParams();
									Ext.Ajax.request({
										url : url + 'cmd?m=CACHE&f=save',
										method : 'POST',
										params:param,
										before:function(){
											Ext.getCmp('CACHE.input').setLoading(true);
										},
										success : function(response) {
											Ext.getCmp('CACHE.input').setLoading(false);
											var r = ajaxSuccess(response);
											if (r.r == 'S') {
												Ext.getCmp('CACHE.input').hide();
												Ext.getCmp('CACHE.list').show();
												Ext.getCmp('CACHE.list').refresh();
											}
										},
										failure : function(jqXHR, exception) {
											Ext.getCmp('CACHE.input').setLoading(false);
											ajaxError(jqXHR, exception,true);
										}
									});
								}
							});
						else{
							if(Ext.getCmp('CACHE.input.p').getValue()=='ADD'){
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
					id : 'CACHE.input.panel',
					layout:'fit',
					paddingBottom:false,
					border:false,
					items:[
						{
							xtype:'tabpanel',
							border:false,
							layout:'fit',
							listeners: {
								'tabchange': function (tabPanel, tab) {
									console.log(tab);
									if(tab.name=='header'){
										var htmlHeader=Ext.getCmp('CACHE.input.htmlHeader');
										htmlHeader.toEditor();
										setTimeout(function(){
											htmlHeader.codemirror.setSize(htmlHeader.bodyEl.dom.clientWidth, htmlHeader.bodyEl.dom.clientHeight);
										},1000);
									}else if(tab.name=='body'){
										var htmlBody=Ext.getCmp('CACHE.input.htmlBody');
										htmlBody.toEditor();
										setTimeout(function(){
											htmlBody.codemirror.setSize(htmlBody.bodyEl.dom.clientWidth, htmlBody.bodyEl.dom.clientHeight);
										},1000);
									}else if(tab.name=='javascript'){
										var htmlJavascript=Ext.getCmp('CACHE.input.htmlJavascript');
										htmlJavascript.toEditor();
										setTimeout(function(){
											htmlJavascript.codemirror.setSize(htmlJavascript.bodyEl.dom.clientWidth, htmlJavascript.bodyEl.dom.clientHeight);
										},1000);
									}else if(tab.name=='css'){
										var css=Ext.getCmp('CACHE.input.css');
										css.toEditor();
										setTimeout(function(){
											css.codemirror.setSize(css.bodyEl.dom.clientWidth, css.bodyEl.dom.clientHeight);
										},1000);
									}
									
								}
							},
							items:[
								{
									title:'Input',
									width: 350,
									border:false,
									items:[
										{
											xtype:'ihiddenfield',
											name:'p',
											id:'CACHE.input.p'
										},{
											xtype:'ihiddenfield',
											name:'i',
											id:'CACHE.input.i'
										},{
											xtype:'itextfield',
											maxLength:64,
											fieldLabel:'Kode Cache',
											name:'f1',
											id:'CACHE.input.f1',
											allowBlank: false
										},{
											xtype:'itextfield',
											name:'f2',
											maxLength:64,
											fieldLabel:'Nama Cache',
											property:{dynamic:true},
											id:'CACHE.input.f2',
											result:'dynamic',
											allowBlank: false
										},{
											xtype:'itextarea',
											name:'f3',
											fieldLabel:'Description',
											id:'CACHE.input.f3',
											maxLength:128,
										}, {
											xtype:'iinput',
											label :'Session',
											items : [
												{
													xtype:'itextfield',
													id : 'CACHE.input.f6',
													name : 'f6',
													margin:false,
													note:'Session di ambil dari link address bar ketika masuk ke cpanel.',
													width:150,
													emptyText: 'Masukan Session'
												},{
													xtype:'displayfield',
													value:'&nbsp;'
												},{
													xtype:'button',
													text:'Generate',
													iconCls:'fa fa-refresh',
													handler:function(){
														Ext.Ajax.request({
															url : url + 'cmd?m=CACHE&f=generate',
															params:{sesi:Ext.getCmp('CACHE.input.f6').getValue()},
															method : 'GET',
															before:function(){
																Ext.getCmp('CACHE.input').setLoading(true);
															},
															success : function(response) {
																Ext.getCmp('CACHE.input').setLoading(false);
																var r = ajaxSuccess(response);
																if (r.r == 'S') {
																	Ext.getCmp('CACHE.input.f7').setValue(r.d);
																}
															},
															failure : function(jqXHR, exception) {
																Ext.getCmp('CACHE.input').setLoading(false);
																ajaxError(jqXHR, exception,true);
															}
														});
													}
												}
											]
										}, {
											xtype:'iinput',
											label :'&nbsp;',
											separator:'&nbsp;',
											items : [
												{
													xtype:'itextarea',
													id : 'CACHE.input.f7',
													name : 'f7',
													columnWidth:1,
													note:'Akan di Generate setelah tekan tombol Generate',
													margin:false,
													emptyText: 'Result',
													allowBlank: false,
												}
											]
										},{
											xtype:'icheckbox',
											name:'f4',
											fieldLabel:'Aktif',
											id:'CACHE.input.f4',
											checked:true
										},{
											xtype:'icheckbox',
											name:'f5',
											fieldLabel:'Sistem',
											id:'CACHE.input.f5',
											checked:true
										}
									]
								},{
									title:'HTML Header',
									layout:'fit',
									name:'header',
									border:false,
									items:[
										{
											xtype:'itextarea',
											id : 'CACHE.input.htmlHeader',
											name : 'htmlHeader',
											margin:false,
											allowBlank: false,
										}
									]
								},{
									title:'HTML Body',
									layout:'fit',
									name:'body',
									border:false,
									items:[
										{
											xtype:'itextarea',
											id : 'CACHE.input.htmlBody',
											name : 'htmlBody',
											margin:false,
											allowBlank: false,
										}
									]
								},{
									title:'Javascript',
									layout:'fit',
									name:'javascript',
									border:false,
									items:[
										{
											xtype:'itextarea',
											id : 'CACHE.input.htmlJavascript',
											name : 'htmlJavascript',
											margin:false,
											allowBlank: false,
										}
									]
								},{
									title:'CSS',
									name:'css',
									layout:'fit',
									border:false,
									items:[
										{
											xtype:'itextarea',
											id : 'CACHE.input.css',
											name : 'css',
											margin:false,
											allowBlank: false,
										}
									]
								}
							]
						},
						
					]
				}
			]
		},
		{xtype:'iconfirm',id : 'CACHE.confirm'}
	]
});