/*
	import cmp.ipanel
	import cmp.iinput
	import cmp.itable
	import cmp.ihtmleditor
	import cmp.icombobox
	import cmp.ilistdata
	import cmp.idynamicoption
	import cmp.idatefield
	import PARAMETER.iparameter
*/
shortcut.set({
	code:'main',
	list:[
		{
			key:'f5',
			fn:function(){
				Ext.getCmp('MAIL_IN.list').refresh();
			}
		},{
			key:'ctrl+f',
			fn:function(){
				Ext.getCmp('MAIL_IN.text').focus();
			}
		},{
			key:'ctrl+shift+f',
			fn:function(){
				_click('MAIL_IN.btnShowSearch');
			}
		},{
			key:'f9',
			fn:function(){
				_click('MAIL_IN.btnAdd');
			}
		}
	]
});
new Ext.Panel({
	id : 'MAIL_IN.main',
	layout:'fit',
	border:false,
	items : [
		{
			xtype:'iwindow',
			iconCls:'fa fa-search',
			id:'MAIL_IN.search',
			modal:false,
			title:'Pekerjaan - Pencarian',
			listeners:{
				show:function(){
					shortcut.set({
						code:'search',
						list:[
							{
								key:'esc',
								fn:function(){
									_click('MAIL_IN.search.btnSearch');
								}
							},{
								key:'ctrl+r',
								fn:function(){
									_click('MAIL_IN.search.btnReset');
								}
							},{
								key:'ctrl+s',
								fn:function(){
									_click('MAIL_IN.search.btnSearch');
								}
							},{
								key:'ctrl+f',
								fn:function(){
									Ext.getCmp('MAIL_IN.search.f1').focus();
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
					iconCls:'fa fa-search',
					id:'MAIL_IN.search.btnSearch',
					handler: function() {
						Ext.getCmp('MAIL_IN.list').refresh(true);
					}
				},{
					text: 'Reset',
					tooltip:'Reset <b>[Ctrl+r]</b>',
					iconCls:'fa fa-eraser',
					id:'MAIL_IN.search.btnReset',
					handler: function() {
						Ext.getCmp('MAIL_IN.search.panel').qReset();
					}
				},{
					text: 'Keluar',
					tooltip:'Keluar <b>[Esc]</b>',
					iconCls:'fa fa-close',
					id:'MAIL_IN.search.btnClose',
					handler: function() {
						Ext.getCmp('MAIL_IN.search').close();
					}
				}
			],
			items:[
				{
					xtype:'ipanel',
					id : 'MAIL_IN.search.panel',
					width: 350,
					items:[
						{
							xtype:'itextfield',
							name:'f1',
							fieldLabel:'Subject',
							press:{
								enter:function(){
									_click('MAIL_IN.search.btnSearch');
								}
							},
							id:'MAIL_IN.search.f1'
						},{
							xtype:'itextfield',
							name:'f2',
							fieldLabel:'From',
							press:{
								enter:function(){
									_click('MAIL_IN.search.btnSearch');
								}
							},
							id:'MAIL_IN.search.f2'
						},{
							xtype:'itextfield',
							name:'f6',
							fieldLabel:'Body',
							press:{
								enter:function(){
									_click('MAIL_IN.search.btnSearch');
								}
							},
							id:'MAIL_IN.search.f6'
						},{
							xtype:'iinput',
							label :'Receive Date',
							items : [
								{
									xtype:'idatefield',
									id : 'MAIL_IN.search.f3',
									name : 'f3',
									margin:false,
									press:{
										enter:function(){
											_click('MAIL_IN.search.btnSearch');
										}
									},
									emptyText: 'First'
								},{
									xtype:'displayfield',
									value:' &nbsp; - &nbsp; '
								},{
									xtype:'idatefield',
									id : 'MAIL_IN.search.f4',
									margin:false,
									database:{
										table:'app_employee',
										field:'M.birth_date',
										separator:'<='
									},
									name : 'f4',
									press:{
										enter:function(){
											_click('MAIL_IN.search.btnSearch');
										}
									},
									emptyText: 'End'
								}
							]
						},{
							xtype:'iparameter',
							id : 'MAIL_IN.search.f5',
							parameter:'ACTIVE_FLAG',
							name : 'f5',
							press:{
								enter:function(){
									_click('MAIL_IN.search.btnSearch');
								},
							},
							width: 200,
							fieldLabel: 'Read'
						}
					]
				}
			]
		},{
			xtype:'itable',
			id:'MAIL_IN.list',
			columnLines : false,
			params:function(bo){
				if(bo==true){
					return Ext.getCmp('MAIL_IN.search.panel').qParams();
				}else{
					var obj={};
					obj[Ext.getCmp('MAIL_IN.dropdown').getValue()]=Ext.getCmp('MAIL_IN.text').getValue();
					return obj;
				}
			},
			hideHeaders: true,
			url:url + 'cmd?m=MAIL_IN&f=getList',
			result:function(response){
				return {list:response.d,total:response.t};
			},
			fn:{
				delete:function(a){
					_access('MAIL_IN_DELETE',function(){
						// Ext.getCmp('MAIL_IN.confirm').confirm({
							// msg : "Apakah akan Menghapus Pekerjaan '"+a.f1+"' ?",
							// allow : 'MAIL_IN.delete',
							// onY : function() {
								// Ext.Ajax.request({
									// url : url + 'cmd?m=MAIL_IN&f=delete',
									// method : 'POST',
									// params : {
										// i : a.f1
									// },
									// before:function(){
										// Ext.getCmp('MAIL_IN.list').setLoading('Menghapus Pekerjaan '+a.f1);
									// },
									// success : function(response) {
										// Ext.getCmp('MAIL_IN.list').setLoading(false);
										// var r = ajaxSuccess(response);
										// if (r.r == 'S'){
											// // socket.send('USERMODULE','MAIL_IN','DELETE');
										// }
											// Ext.getCmp('MAIL_IN.list').refresh();
									// },
									// failure : function(jqXHR, exception) {
										// Ext.getCmp('MAIL_IN.list').setLoading(false);
										// ajaxError(jqXHR, exception,true);
									// }
								// });
							// }
						// });
					});
				},
				update:function(a){
					_access('MAIL_IN_UPDATE',function(){
						Ext.Ajax.request({
							url : url + 'cmd?m=MAIL_IN&f=initUpdate',
							params:{i:a.i},
							method : 'GET',
							before:function(){
								Ext.getCmp('MAIL_IN.list').setLoading('Mengambil Kode Pekerjaan '+a.f1);
							},
							success : function(response) {
								Ext.getCmp('MAIL_IN.list').setLoading(false);
								var r = ajaxSuccess(response);
								if (r.r == 'S') {
									var o=r.d;
									Ext.getCmp('MAIL_IN.input.panel').qReset();
									Ext.getCmp('MAIL_IN.input.i').setValue(a.i);
									Ext.getCmp('MAIL_IN.input.b').setValue(o.body);
									Ext.getCmp('MAIL_IN.list').hide();
									Ext.getCmp('MAIL_IN.reply').hide();
									Ext.getCmp('MAIL_IN.input').show();
									Ext.getCmp('MAIL_IN.input.body').update(o.body);
									// Ext.getCmp('MAIL_IN.input.f2').focus();
									Ext.getCmp('MAIL_IN.input.panel').qSetForm()
								}
							},
							failure : function(jqXHR, exception) {
								Ext.getCmp('MAIL_IN.list').setLoading(false);
								ajaxError(jqXHR, exception,true);
							}
						});
					});
				}
			},
			press:{
				delete:function(a){
					Ext.getCmp('MAIL_IN.list').fn.delete(a.dataRow);
				},
				enter:function(a){
					Ext.getCmp('MAIL_IN.list').fn.update(a.dataRow);
				}
			},
			tbar:[iif(_mobile,'<b>Inbox</b>',''),{xtype:'ibuttonnewtab'},{xtype:'ibuttonfullscreen'},'->',{
				xtype:'buttongroup',
				id:'MAIL_IN.group.search',
				hidden:_mobile,
				items:[
					{
						xtype:'icombobox',
						id : 'MAIL_IN.dropdown',
						emptyText:'Pencarian',
						margin:false,
						value:'f1',
						data:[
							{id:'f2',text:'Email From'},
							{id:'f1',text:'Subject'},
							{id:'f6',text:'Body'},
						],
						width: 150,
						press:{
							enter:function(){
								_click('MAIL_IN.btnSearch');
							}
						}
					},{
						xtype:'itextfield',
						width: 200,
						emptyText:'Pencarian',
						margin:false,
						tooltip:'Pencarian [Ctrl+f]',
						id:'MAIL_IN.text',
						press:{
							enter:function(){
								_click('MAIL_IN.btnSearch');
							}
						}
					},{
						iconCls: 'fa fa-search',
						tooltip:'Pencarian [F5]',
						id:'MAIL_IN.btnSearch',
						handler : function(a) {
							Ext.getCmp('MAIL_IN.list').refresh(false);
						}
					}
				]
			},{
				tooltip:'Pencarian <b>[Ctrl+Shift+f]</b>',
				id:'MAIL_IN.btnShowSearch',
				iconCls: 'fa fa-filter',
				handler:function(a){
					Ext.getCmp('MAIL_IN.search').show();
					Ext.getCmp('MAIL_IN.search.f1').focus();
				}
			}],
			columns:[
				{ text: 'Read',width: 50,sortable :false,dataIndex: 'f4',align:'center',
					renderer: function(value){
						if(value==0)
							return '<span class="fa fa-eye-slash" style="font-weight: bold;"></span>';
						return '<span class="fa fa-eye"></span>';
					}
				},{ hidden:true, hideable:false,dataIndex: 'i' },
				{ text: 'Time',width: 150, dataIndex: 'f1',renderer:function(value,meta,a,b,c,d){return value;}},
				{ text: 'From',flex:1,dataIndex: 'f2',renderer:function(value,meta,a,b,c,d){return value;}},
				{ text: 'Subject',dataIndex: 'f3',renderer:function(value,meta,a,b,c,d){return value;}},
				{
					text: 'View',
					width: 40,
					menuDisabled: true,
					hideable:false,
					xtype: 'actioncolumn',
					align: 'center',
					iconCls: 'fa fa-arrow-circle-right',
					handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
						Ext.getCmp('MAIL_IN.list').fn.update(record.data);
					}
				}
			]
		},{
			id:'MAIL_IN.input',
			border:false,
			hidden:true,
			layout:'fit',
			listeners:{
				show:function(){
					shortcut.set({
						code:'input',
						list:[
							{
								key:'esc',
								fn:function(){
									_click('MAIL_IN.input.btnClose');
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
					id:'MAIL_IN.input.btnClose',
					iconCls:'fa fa-chevron-left fa-red',
					handler: function() {
						Ext.getCmp('MAIL_IN.input').hide();
						Ext.getCmp('MAIL_IN.list').show();
					}
				},'->','<b>Inbox</b>','->',
				{
					xtype:'buttongroup',
					items:[
						{
							text: 'Balas',
							tooltip:'Balas <b>[Ctrl+s]</b>',
							id:'MAIL_IN.input.btnReply',
							iconCls:'fa fa-reply',
							handler: function() {
								Ext.getCmp('MAIL_IN.reply.f2').setValue('');
								Ext.getCmp('MAIL_IN.reply').show();
								Ext.getCmp('MAIL_IN.reply.f2').focus();
							}
						},{
							text: 'Teruskan',
							tooltip:'Balas <b>[Ctrl+s]</b>',
							id:'MAIL_IN.input.btnContinue',
							iconCls:'fa fa-arrow-right',
							handler: function() {
								Ext.getCmp('MAIL_IN.reply.f2').setValue(Ext.getCmp('MAIL_IN.input.b').getValue());
								Ext.getCmp('MAIL_IN.reply').show();
								Ext.getCmp('MAIL_IN.reply.f2').focus();
							}
						}
					]
				}
			],
			items:[
				{
					xtype:'ipanel',
					id : 'MAIL_IN.input.panel',
					paddingBottom:false,
					autoScroll:true,
					layout:{
						type:'vbox',
						align:'stretch'
					},
					items:[
						{
							xtype:'ihiddenfield',
							name:'i',
							id:'MAIL_IN.input.i'
						},{
							xtype:'ihiddenfield',
							name:'i',
							id:'MAIL_IN.input.b'
						},{
							id:'MAIL_IN.input.body',
							border:false,
						},{
							id:'MAIL_IN.reply',
							margin:true,
							paddingBottom:false,
							tbar: [
								'->',
								{
									xtype:'buttongroup',
									items:[
										{
											text: 'Kirim',
											tooltip:'Kirim',
											id:'MAIL_IN.reply.btnSave',
											iconCls:'fa fa-save',
											handler: function() {
												// var req=Ext.getCmp('ARTICLE.input.panel').qGetForm(true);
												// if(req == false){
													// var param = Ext.getCmp('ARTICLE.input.panel').qParams();
													// Ext.Ajax.request({
														// url : url + 'cmd?m=ARTICLE&f=save',
														// method : 'POST',
														// params:param,
														// before:function(){
															// Ext.getCmp('ARTICLE.input').setLoading(true);
														// },
														// success : function(response) {
															// Ext.getCmp('ARTICLE.input').setLoading(false);
															// var r = ajaxSuccess(response);
															// if (r.r == 'S') {
																// Ext.getCmp('ARTICLE.list').refresh();
																// Ext.getCmp('ARTICLE.input.i').setValue(r.d.id);
																// Ext.getCmp('ARTICLE.input.f2').setValue(r.d.text);
																// Ext.getCmp('ARTICLE.input.panel').qSetForm();
																// socket.send('USERMODULE','ARTICLE','SAVE');
															// }
														// },
														// failure : function(jqXHR, exception) {
															// Ext.getCmp('ARTICLE.input').setLoading(false);
															// ajaxError(jqXHR, exception);
														// }
													// });
												// }else{
													// if(Ext.getCmp('ARTICLE.input.p').getValue()=='ADD'){
														// Ext.create('App.cmp.Toast').toast({msg : 'Periksa Kembali Datanya.',type : 'warning'});
													// }else{
														// Ext.create('App.cmp.Toast').toast({msg : 'Tidak ada Perbubahan Data.',type : 'warning'});
													// }
												// }
											}
										},{
											text: 'File',
											tooltip:'Keluar <b>[Esc]</b>',
											iconCls:'fa fa-file',
											handler: function() {
												// new Ext.create('App.cmp.Window',{
													// title:'File Manager',
													// layout:'fit',
													// width: 300,
													// height: 300,
													// items:[
														// new Ext.create('App.cmp.FileManager',{
															// user:_employee_id
														// })
													// ]
												// }).show();
											}
										}
									]
								}
							],
							items:[
								{
									xtype:'ipanel',
									id : 'MAIL_IN.reply.panel',
									paddingBottom:false,
									items:[
										{
											xtype:'ihiddenfield',
											name:'i',
											id:'MAIL_IN.reply.i'
										},{
											xtype:'iinput',
											label :'Kepada',
											items : [
												{
													xtype:'ilistdata',
													id:'MAIL_IN.reply.to',
													// height:30,
													minHeight:30,
													name:'options',
													margin:false,
													items:[
														{
															xtype:'idynamicoption',
															name:'to',
															type:'DO_EMAIL',
															emptyText:'Kode Opsi',
															text:'Kode Opsi',
															width: 150,
															dynamic:false,
															getParent:function(){
																return _user_id;	
															},
															allowBlank: false
														}
													]
												}
											]
										},{
											xtype:'iinput',
											label :'CC',
											items : [
												{
													xtype:'ilistdata',
													id:'MAIL_IN.reply.cc',
													// height:30,
													minHeight:30,
													name:'cc',
													addLine:false,
													margin:false,
													items:[
														{
															xtype:'idynamicoption',
															name:'cc',
															type:'DO_EMAIL',
															emptyText:'Kode Opsi',
															text:'Kode Opsi',
															width: 150,
															dynamic:false,
															getParent:function(){
																return _user_id;	
															},
															allowBlank: false
														}
													]
												}
											]
										},{
											xtype:'iinput',
											label :'BCC',
											items : [
												{
													xtype:'ilistdata',
													id:'MAIL_IN.reply.bcc',
													// height:30,
													minHeight:30,
													name:'bcc',
													margin:false,
													addLine:false,
													items:[
														{
															xtype:'idynamicoption',
															name:'bcc',
															type:'DO_EMAIL',
															emptyText:'Kode Opsi',
															text:'Kode Opsi',
															width: 150,
															dynamic:false,
															getParent:function(){
																return _user_id;	
															},
															allowBlank: false
														}
													]
												}
											]
										},{
											xtype:'ihtmleditor',
											id:'MAIL_IN.reply.f2',
											margin:true,
											name:'f2',
											height: 400,
										}
									]
								}
							]
						}
					]
				}
			],
			// qBeforeClose : function() {
				// var $this = this;
				// $this.closing = false;
				// if (Ext.getCmp('MAIL_IN.input.panel').qGetForm() == false)
					// Ext.getCmp('MAIL_IN.confirm').confirm({
						// msg :'Apakah Akan Mengabaikan Data Yang Sudah diUbah ?',
						// allow : 'MAIL_IN.close',
						// onY : function() {
							// $this.qClose();
						// }
					// });
				// else
					// $this.qClose();
				// return false;
			// }
		},{xtype:'iconfirm',id : 'MAIL_IN.confirm'}
	]
});
