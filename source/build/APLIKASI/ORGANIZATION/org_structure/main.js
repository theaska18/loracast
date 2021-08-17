/*
	import cmp.orgchart
	import cmp.iconfig
	import cmp.iselect
	import cmp.itextarea
	import cmp.iinput
	import PARAMETER.iparameter
	import cmp.idatefield
	import cmp.ipanel
*/
shortcut.set({
	code:'main',
	module:'ORG_STRUCTURE',
	list:[
		{
			key:'f5',
			fn:function(){
				_click('ORG_STRUCTURE.btnRefresh');
			}
		},{
			key:'f6',
			fn:function(){
				_click('ORG_STRUCTURE.btnAdd');
			}
		}
	]
});
new Ext.Panel({
	id : 'ORG_STRUCTURE.main',
	layout:'fit',
	border:false,
	items : [
		{
			xtype:'treepanel',
			id : 'ORG_STRUCTURE.list',
			border : false,
			rootVisible : false,
			lines : true,
			flex:1,
			rowLines : true,
			root : {
				expanded : false
			},
			tbar : [iif(_mobile,'<b>Struktur</b>',''),{xtype:'ibuttonnewtab'},{xtype:'ibuttonfullscreen'},{
					xtype:'iconfig',
					id:'ORG_STRUCTURE.config',
					menuCode:'ORG_STRUCTURE',
					code:[
						iif(_access('ORG_STRUCTURE_config_SEQUENCE')==false,'SEQUENCE',null),
						iif(_access('ORG_STRUCTURE_config_SEQUENCE_CODE')==false,'SEQUENCE_CODE',null)
					]
				},'->',{
					text: 'Tambah',
					tooltip:'Tambah <b>[F6]</b>',
					iconCls: 'fa fa-plus fa-green',
					id:'ORG_STRUCTURE.btnAdd',
					handler : function(a) {
						_access('ORG_STRUCTURE_ADD',function(){
							Ext.getCmp('ORG_STRUCTURE.input').closing = false;
							Ext.getCmp('ORG_STRUCTURE.input.panel').qReset();
							Ext.getCmp('ORG_STRUCTURE.input.pc').setValue(null);
							Ext.getCmp('ORG_STRUCTURE.input.f5').setReadOnly(true);
							Ext.getCmp('ORG_STRUCTURE.input.f2').setReadOnly(false);
							Ext.getCmp('ORG_STRUCTURE.input.f3').setReadOnly(false);
							Ext.getCmp('ORG_STRUCTURE.input.f4').setReadOnly(false);
							Ext.getCmp('ORG_STRUCTURE.input.p').setValue('ADD');
							Ext.getCmp('ORG_STRUCTURE.input.panel').qSetForm();
							Ext.getCmp('ORG_STRUCTURE.list').hide();
							Ext.getCmp('ORG_STRUCTURE.input').show();
							// Ext.getCmp('ORG_STRUCTURE.input').setTitle('Struktur - Tambah');
							if(getSetting('ORG_STRUCTURE','SEQUENCE')=='Y'){
								Ext.getCmp('ORG_STRUCTURE.input.f1').setReadOnly(true);
								Ext.getCmp('ORG_STRUCTURE.input.f2').focus();
							}else{
								Ext.getCmp('ORG_STRUCTURE.input.f1').setReadOnly(false);
								Ext.getCmp('ORG_STRUCTURE.input.f1').focus();
							}
						});
					}
				},{
					text: iif(_mobile,null,'Refresh'),
					tooltip:'Refresh <b>[F5]</b>',
					id:'ORG_STRUCTURE.btnRefresh',
					iconCls: 'fa fa-refresh',
					handler : function(a) {
						Ext.Ajax.request({
							url : url + 'cmd?m=ORG_STRUCTURE&f=getList',
							method : 'GET',
							before:function(){
								Ext.getCmp('main.tabORG_STRUCTURE').setLoading(true);
							},
							success : function(response) {
								Ext.getCmp('main.tabORG_STRUCTURE').setLoading(false);
								var r = ajaxSuccess(response);
								if (r.r == 'S') {
									Ext.getCmp('ORG_STRUCTURE.list').store.setRootNode([]);
									var c = Ext.getCmp('ORG_STRUCTURE.list').store.getRootNode();
									if(r.d.length>0){
										c.insertChild(1, r.d);
									}
									Ext.getCmp('ORG_STRUCTURE.list').expandAll()
								}
							},
							failure : function(jqXHR, exception) {
								Ext.getCmp('main.tabORG_STRUCTURE').setLoading(false);
								ajaxError(jqXHR, exception,true);
							}
						});
					}
				}
			],
			columns : [
				{
					xtype : 'treecolumn',
					text : 'Struktur',
					sortable:false,
					menuDisabled : true,
					flex : 1,
					minWidth:300,
					dataIndex : 'text'
				},{
					text : 'Hirarki',
					width : 55,
					menuDisabled : true,
					xtype : 'actioncolumn',
					align : 'center',
					iconCls : 'fa fa-sitemap',
					handler : function(grid, rowIndex, colIndex, actionItem, event,record, row) {
						_access('ORG_STRUCTURE_HIERARCHY',function(){
							Ext.getCmp('ORG_STRUCTURE.list').hide();
							Ext.getCmp('ORG_STRUCTURE.hierarchy').show();
							Ext.getCmp('ORG_STRUCTURE.hierarchy.panel').update('<div id="ORG_STRUCTURE_chart" style="width: 100%;height: 100%;overflow: auto;" class="orgChart"></div>');
							Ext.Ajax.request({
								url : url + 'cmd?m=ORG_STRUCTURE&f=getHierarchy',
								method : 'GET',
								params:{i:record.raw.i},
								before:function(){
									Ext.getCmp('ORG_STRUCTURE.hierarchy').setLoading(true);
								},
								success : function(response) {
									Ext.getCmp('ORG_STRUCTURE.hierarchy').setLoading(false);
									var r = ajaxSuccess(response);
									if (r.r == 'S') {
										function addHierachy(objl){
											var txt='<b><u>'+objl.text+'</u></b>';
											if(objl.f1 !=''){
												txt+='<br>';
												txt+=objl.f1;
											}
											if(objl.members.length>0){
												var lastJobName='';
												var jobNum=0;
												var txtSub='';
												for(var i=0,iLen=objl.members.length; i<iLen;i++){
													if(objl.members[i].name !=objl.f1){
														if(lastJobName!=objl.members[i].job_name){
															lastJobName=objl.members[i].job_name;
															if(objl.members[i].job_name != null && objl.members[i].job_name !=''){
																if(txtSub !==''){
																	txtSub+="<br>";
																}
																txtSub+='<i>'+objl.members[i].job_name+':</i>';
															}
															jobNum=1;
														}
														if(txtSub !==''){
															txtSub+="<br>";
														}
														txtSub+=jobNum+'. '+objl.members[i].name;
														jobNum++;
													}
												}
												if(txtSub !==''){
													txtSub="<div class='sub-node'>"+txtSub+"</div>";
												}
												txt+=txtSub;
											}
											var SubrootNode = new ExtJSOrgChart.createNode(1,txt);
											if(objl.child.length>0){
												for(var i=0,iLen=objl.child.length; i<iLen;i++){
													SubrootNode.addChild(addHierachy(objl.child[i]));
												}
											}
											return SubrootNode;
										}
										var rootNode=addHierachy(r.d.l[0]);
										console.log(rootNode);
										ExtJSOrgChart.prepareTree({
											chartElement: 'ORG_STRUCTURE_chart',
											rootObject: rootNode,
											title:r.d.o,
											depth: -1
										});	
									}
								},
								failure : function(jqXHR, exception) {
									Ext.getCmp('ORG_STRUCTURE.hierarchy').setLoading(false);
									ajaxError(jqXHR, exception,true);
								}
							});
						});
					}
				},{
					text : 'Tambah',
					width : 55,
					hideable:false,
					menuDisabled : true,
					xtype : 'actioncolumn',
					align : 'center',
					iconCls : 'fa fa-plus fa-green',
					handler : function(grid, rowIndex, colIndex, actionItem, event,record, row) {
						_access('ORG_STRUCTURE_ADD',function(){
							Ext.getCmp('ORG_STRUCTURE.input.panel').qReset();
							Ext.getCmp('ORG_STRUCTURE.input.pc').setValue(record.raw.i);
							// Ext.getCmp('ORG_STRUCTURE.input.f1').setReadOnly(false);
							Ext.getCmp('ORG_STRUCTURE.input.f2').setReadOnly(false);
							Ext.getCmp('ORG_STRUCTURE.input.f3').setReadOnly(false);
							Ext.getCmp('ORG_STRUCTURE.input.f4').setReadOnly(false);
							Ext.getCmp('ORG_STRUCTURE.input.f5').setReadOnly(true);
							Ext.getCmp('ORG_STRUCTURE.input.p').setValue('ADD');
							Ext.getCmp('ORG_STRUCTURE.input.panel').qSetForm();
							Ext.getCmp('ORG_STRUCTURE.list').hide();
							Ext.getCmp('ORG_STRUCTURE.input').show();
							// Ext.getCmp('ORG_STRUCTURE.input').setTitle('Struktur - Tambah');
							if(getSetting('ORG_STRUCTURE','SEQUENCE')=='Y'){
								Ext.getCmp('ORG_STRUCTURE.input.f1').setReadOnly(true);
								Ext.getCmp('ORG_STRUCTURE.input.f2').focus();
							}else{
								Ext.getCmp('ORG_STRUCTURE.input.f1').setReadOnly(false);
								Ext.getCmp('ORG_STRUCTURE.input.f1').focus();
							}
						});
					}
				},{
					text : 'Edit',
					width : 55,
					menuDisabled : true,
					xtype : 'actioncolumn',
					align : 'center',
					iconCls : 'fa fa-edit',
					handler : function(grid, rowIndex, colIndex, actionItem, event,record, row) {
						_access('ORG_STRUCTURE_UPDATE',function(){
							Ext.Ajax.request({
								url : url + 'cmd?m=ORG_STRUCTURE&f=initUpdate',
								method : 'GET',
								params:{i:record.raw.i},
								before:function(){
									Ext.getCmp('main.tabORG_STRUCTURE').setLoading(true);
								},
								success : function(response) {
									Ext.getCmp('main.tabORG_STRUCTURE').setLoading(false);
									var r = ajaxSuccess(response);
									if (r.r == 'S') {
										Ext.getCmp('ORG_STRUCTURE.input.panel').qReset();
										var o=r.d;
										Ext.getCmp('ORG_STRUCTURE.input').closing = false;
										Ext.getCmp('ORG_STRUCTURE.input.f1').setReadOnly(true);
										Ext.getCmp('ORG_STRUCTURE.input.f2').setReadOnly(false);
										Ext.getCmp('ORG_STRUCTURE.input.f3').setReadOnly(false);
										Ext.getCmp('ORG_STRUCTURE.input.f4').setReadOnly(false);
										Ext.getCmp('ORG_STRUCTURE.input.f1').setValue(o.f1);
										Ext.getCmp('ORG_STRUCTURE.input.i').setValue(record.raw.i);
										Ext.getCmp('ORG_STRUCTURE.input.f5').setReadOnly(true);
										Ext.getCmp('ORG_STRUCTURE.input.f2').setValue(o.f2);
										Ext.getCmp('ORG_STRUCTURE.input.f3').setValue(o.f3);
										Ext.getCmp('ORG_STRUCTURE.input.f4').setValue(o.f4);
										Ext.getCmp('ORG_STRUCTURE.input.p').setValue('UPDATE');
										// Ext.getCmp('ORG_STRUCTURE.input').setTitle('Struktur - Edit');
										Ext.getCmp('ORG_STRUCTURE.list').hide();
										Ext.getCmp('ORG_STRUCTURE.input').show();
										Ext.getCmp('ORG_STRUCTURE.input.panel').qSetForm();
										Ext.getCmp('ORG_STRUCTURE.input.f2').focus();
									}
								},
								failure : function(jqXHR, exception) {
									Ext.getCmp('main.tabORG_STRUCTURE').setLoading(false);
									ajaxError(jqXHR, exception,true);
								}
							});
						});
					}
				},{
					text : 'Kepala',
					width : 55,
					menuDisabled : true,
					xtype : 'actioncolumn',
					align : 'center',
					iconCls : 'fa fa-cog',
					handler : function(grid, rowIndex, colIndex, actionItem, event,record, row) {
						_access('ORG_STRUCTURE_HEAD',function(){
							Ext.Ajax.request({
								url : url + 'cmd?m=ORG_STRUCTURE&f=initHead',
								method : 'GET',
								params:{i:record.raw.i},
								before:function(){
									Ext.getCmp('main.tabORG_STRUCTURE').setLoading(true);
								},
								success : function(response) {
									Ext.getCmp('main.tabORG_STRUCTURE').setLoading(false);
									var r = ajaxSuccess(response);
									if (r.r == 'S') {
										Ext.getCmp('ORG_STRUCTURE.input.panel').qReset();
										var o=r.d;
										Ext.getCmp('ORG_STRUCTURE.input').closing = false;
										Ext.getCmp('ORG_STRUCTURE.input.f1').setReadOnly(true);
										Ext.getCmp('ORG_STRUCTURE.input.f2').setReadOnly(true);
										Ext.getCmp('ORG_STRUCTURE.input.f3').setReadOnly(true);
										Ext.getCmp('ORG_STRUCTURE.input.f4').setReadOnly(true);
										Ext.getCmp('ORG_STRUCTURE.input.f1').setValue(o.f1);
										Ext.getCmp('ORG_STRUCTURE.input.i').setValue(record.raw.i);
										Ext.getCmp('ORG_STRUCTURE.input.f5').setReadOnly(false);
										if(o.f5 != null && o.f5 !=''){
											Ext.getCmp('ORG_STRUCTURE.input.f5').setValue({employee_id:o.f5,name:o.f6});
										}
										Ext.getCmp('ORG_STRUCTURE.input.f2').setValue(o.f2);
										Ext.getCmp('ORG_STRUCTURE.input.f3').setValue(o.f3);
										Ext.getCmp('ORG_STRUCTURE.input.f4').setValue(o.f4);
										Ext.getCmp('ORG_STRUCTURE.input.p').setValue('HEAD');
										// Ext.getCmp('ORG_STRUCTURE.input').setTitle('Struktur - Edit');
										Ext.getCmp('ORG_STRUCTURE.list').hide();
										Ext.getCmp('ORG_STRUCTURE.input').show();
										Ext.getCmp('ORG_STRUCTURE.input.panel').qSetForm();
										Ext.getCmp('ORG_STRUCTURE.input.f5').focus();
									}
								},
								failure : function(jqXHR, exception) {
									Ext.getCmp('main.tabORG_STRUCTURE').setLoading(false);
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
						_access('ORG_STRUCTURE_DELETE',function(){
							if(record.data.children==null || record.data.children.length==0){
								Ext.getCmp('ORG_STRUCTURE.confirm').confirm({
									msg : "Apakah Akan Menghapus Kode Struktur '"+record.raw.f1+"' ?",
									allow : 'ORG_STRUCTURE.delete',
									onY : function() {
										Ext.Ajax.request({
											url : url + 'cmd?m=ORG_STRUCTURE&f=delete',
											method : 'POST',
											params : {
												i : record.raw.i
											},
											before:function(){
												Ext.getCmp('main.tabORG_STRUCTURE').setLoading(true);
											},
											success : function(response) {
												Ext.getCmp('main.tabORG_STRUCTURE').setLoading(false);
												var r = ajaxSuccess(response);
												if (r.r == 'S') {
													Ext.Ajax.request({
														url : url + 'cmd?m=ORG_STRUCTURE&f=getList',
														method : 'GET',
														before:function(){
															Ext.getCmp('main.tabORG_STRUCTURE').setLoading('Mengambil Data');
														},
														success : function(response) {
															Ext.getCmp('main.tabORG_STRUCTURE').setLoading(false);
															var r = ajaxSuccess(response);
															if (r.r == 'S') {
																Ext.getCmp('ORG_STRUCTURE.list').store.setRootNode([]);
																var c = Ext.getCmp('ORG_STRUCTURE.list').store.getRootNode();
																if(r.d.length>0){
																	c.insertChild(1, r.d);
																}
																Ext.getCmp('ORG_STRUCTURE.list').expandAll()
															}
														},
														failure : function(jqXHR, exception) {
															Ext.getCmp('main.tabORG_STRUCTURE').setLoading(false);
															ajaxError(jqXHR, exception,true);
														}
													});
												}
											},
											failure : function(jqXHR, exception) {
												Ext.getCmp('main.tabORG_STRUCTURE').setLoading(false);
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
			layout:'fit',
			id:'ORG_STRUCTURE.hierarchy',
			hidden:true,
			border:false,
			tbar:[
				{
					text: 'Kembali',
					tooltip:'Kembali <b>[Esc]</b>',
					id:'ORG_STRUCTURE.hierarchy.btnClose',
					iconCls:'fa fa-chevron-left fa-red',
					handler: function() {
						Ext.getCmp('ORG_STRUCTURE.hierarchy').hide();
						Ext.getCmp('ORG_STRUCTURE.list').show();
					}
				},'->','<b>Hirarki</b>','->'
			],
			items:[
				{
					xtype:'panel',
					border: false,
					id:'ORG_STRUCTURE.hierarchy.panel',
					html:'<div id="ORG_STRUCTURE_chart" style="width: 100%;height: 100%;overflow: auto;" class="orgChart"></div>'
				}
			]
		},{
			id 		: 'ORG_STRUCTURE.input',
			hidden 	: true,
			border:false,
			listeners:{
				show:function(){
					shortcut.set({
						code:'input',
						list:[
							{
								key:'ctrl+s',
								fn:function(){
									_click('ORG_STRUCTURE.input.btnSave');
								}
							},{
								key:'esc',
								fn:function(){
									_click('ORG_STRUCTURE.input.btnClose');
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
					text : 'Kembali',
					tooltip:'Kembali <b>[Esc]</b>',
					id:'ORG_STRUCTURE.input.btnClose',
					iconCls : 'fa fa-chevron-left fa-red',
					handler : function() {
						var req=Ext.getCmp('ORG_STRUCTURE.input.panel').qGetForm();
						if(req == false){
							Ext.getCmp('ORG_STRUCTURE.confirm').confirm({
								msg :'Apakah Akan Mengabaikan data Yang sudah Berubah ?',
								allow : 'ORG_STRUCTURE.close',
								onY : function() {
									Ext.getCmp('ORG_STRUCTURE.input').hide();
									Ext.getCmp('ORG_STRUCTURE.list').show();
								}
							});
						}else{
							Ext.getCmp('ORG_STRUCTURE.input').hide();
							Ext.getCmp('ORG_STRUCTURE.list').show();
						}
					}
				},'->','<b>Input Struktur</b>','->',{
					xType 	: 'button',
					text 	: 'Simpan',
					tooltip	:'Simpan <b>[Ctrl+s]</b>',
					id		: 'ORG_STRUCTURE.input.btnSave',
					iconCls 	: 'fa fa-save fa-green',
					handler : function() {
						var req=Ext.getCmp('ORG_STRUCTURE.input.panel').qGetForm(true);
						if (req== false) 
							Ext.getCmp('ORG_STRUCTURE.confirm').confirm({
								msg : 'Apakah Akan Save Data ini ?',
								allow : 'ORG_STRUCTURE.save',
								onY : function() {
									var param = Ext.getCmp('ORG_STRUCTURE.input.panel').qParams();
									Ext.Ajax.request({
										url : url + 'cmd?m=ORG_STRUCTURE&f=save',
										method : 'POST',
										params : param,
										before:function(){
											Ext.getCmp('ORG_STRUCTURE.input').setLoading(true);
										},
										success : function(response) {
											Ext.getCmp('ORG_STRUCTURE.input').setLoading(false);
											var r = ajaxSuccess(response);
											if (r.r == 'S') {
												Ext.getCmp('ORG_STRUCTURE.input').hide();
												Ext.getCmp('ORG_STRUCTURE.list').show();
												Ext.Ajax.request({
													url : url + 'cmd?m=ORG_STRUCTURE&f=getList',
													method : 'GET',
													before:function(){
														Ext.getCmp('main.tabORG_STRUCTURE').setLoading('Loading');
													},
													success : function(response) {
														Ext.getCmp('main.tabORG_STRUCTURE').setLoading(false);
														var r = ajaxSuccess(response);
														if (r.r == 'S') {
															Ext.getCmp('ORG_STRUCTURE.list').store.setRootNode([]);
															var c = Ext.getCmp('ORG_STRUCTURE.list').store.getRootNode();
															if(r.d.length>0){
																c.insertChild(1, r.d);
															}
															Ext.getCmp('ORG_STRUCTURE.list').expandAll()
														}
													},
													failure : function(jqXHR, exception) {
														Ext.getCmp('main.tabORG_STRUCTURE').setLoading(false);
														ajaxError(jqXHR, exception,true);
													}
												});
											}
										},
										failure : function(jqXHR, exception) {
											Ext.getCmp('ORG_STRUCTURE.input').setLoading(false);
											ajaxError(jqXHR, exception,true);
										}
									});
								}
							});
						else{
							if(Ext.getCmp('ORG_STRUCTURE.input.p').getValue()=='ADD'){
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
					id : 'ORG_STRUCTURE.input.panel',
					width:350,
					submit:'ORG_STRUCTURE.input.btnSave',
					items : [
						{
							xtype:'ihiddenfield',
							id : 'ORG_STRUCTURE.input.pc',
							name : 'pc'
						},{
							xtype:'ihiddenfield',
							id : 'ORG_STRUCTURE.input.i',
							name : 'i'
						},{
							xtype:'ihiddenfield',
							id : 'ORG_STRUCTURE.input.p',
							name : 'p'
						},{
							xtype:'itextfield',
							id : 'ORG_STRUCTURE.input.f1',
							submit:'ORG_STRUCTURE.input.panel',
							property:{
								upper:true,
								space:false
							},
							name : 'f1',
							maxLength:32,
							fieldLabel:'Kode Struktur',
							allowBlank : false
						},{
							xtype:'itextfield',
							id : 'ORG_STRUCTURE.input.f2',
							submit:'ORG_STRUCTURE.input.panel',
							property:{
								dynamic:true
							},
							maxLength:64,
							fieldLabel: 'Nama Struktur',
							name : 'f2',
							allowBlank : false
						},{
							xtype:'iselect',
							fieldLabel:'Kepala',
							id:'ORG_STRUCTURE.input.f5',
							submit:'ORG_STRUCTURE.input.panel',
							valueField:'employee_id',
							note:'Karyawan yang di pilih sebagai kepala.<br> diAmbil dari Menu Karyawan',
							textField:'name',
							name:'f5',
							onBeforeShow:function(){
								Ext.getCmp('ORG_STRUCTURE.input.btnShowKaryawan.f9').setValue(Ext.getCmp('ORG_STRUCTURE.input.i').getValue());
							},
							button:{
								items:[
									{
										xtype:'itextfield',
										fieldLabel:'Nama',
										name:'f2',
										database:{
											table:'app_employee',
											field:'first_name',
											separator:'like'
										},
										press:{
											enter:function(){
												Ext.getCmp('ORG_STRUCTURE.input.f5').refresh();
											}
										},
										id:'ORG_STRUCTURE.input.btnShowKaryawan.f1'
									},{
										xtype:'ihiddenfield',
										name:'f6',
										database:{
											table:'app_employee',
											field:'M.tenant_id',
											type:'double',
											separator:'='
										},
										id:'ORG_STRUCTURE.input.btnShowKaryawan.f2',
										value:_tenant_id
									},{
										xtype:'ihiddenfield',
										name:'f10',
										database:{
											table:'app_employee',
											field:'M.active_flag',
											type:'active',
										},
										value:'Y'
									},{
										xtype:'ihiddenfield',
										name:'f9',
										database:{
											table:'app_employee',
											field:'S.structure_id',
											type:'double'
										},
										id:'ORG_STRUCTURE.input.btnShowKaryawan.f9',
										// value:'(SELECT i.employee_id FROM app_user i)'
									},{
										xtype:'itextfield',
										name:'f1',
										fieldLabel:'ID Number',
										database:{
											table:'app_employee',
											field:'id_number',
											separator:'like'
										},
										press:{
											enter:function(){
												Ext.getCmp('ORG_STRUCTURE.input.f5').refresh();
											}
										}
									},{
										xtype:'iparameter',
										name : 'f3',
										fieldLabel:'Jenis Kelamin',
										database:{
											table:'app_employee',
											field:'gender'
										},
										parameter:'GENDER',
										press:{
											enter:function(){
												Ext.getCmp('ORG_STRUCTURE.input.f5').refresh();
											}
										}
									},{
										xtype:'iinput',
										label :'Tgl. Lahir',
										items : [
											{
												xtype:'idatefield',
												name : 'f4',
												margin:false,
												database:{
													table:'app_employee',
													field:'birth_date',
													separator:'>='
												},
												press:{
													enter:function(){
														Ext.getCmp('ORG_STRUCTURE.input.f5').refresh();
													}
												},
												emptyText: 'Awal'
											},{
												xtype:'displayfield',
												value:' &nbsp; - &nbsp; '
											},{
												xtype:'idatefield',
												margin:false,
												database:{
													table:'app_employee',
													field:'M.birth_date',
													separator:'<='
												},
												name : 'f5',
												press:{
													enter:function(){
														Ext.getCmp('ORG_STRUCTURE.input.f5').refresh();
													}
												},
												emptyText:'Akhir'
											}
										]
									},{
										xtype:'itextfield',
										name:'f7',
										fieldLabel:'Pekerjaan',
										database:{
											table:'app_employee',
											field:'JOB.job_name',
											separator:'like'
										},
										press:{
											enter:function(){
												Ext.getCmp('ORG_STRUCTURE.input.f5').refresh();
											}
										}
									},{
										xtype:'itextfield',
										name:'f8',
										fieldLabel:'Alamat',
										database:{
											table:'app_employee',
											field:'address',
											separator:'like'
										},
										press:{
											enter:function(){
												Ext.getCmp('ORG_STRUCTURE.input.f5').refresh();
											}
										}
									}
								],
								database:{
									table:'app_employee',
									inner:'INNER JOIN app_parameter_option GENDER ON GENDER.option_code=M.gender '+ 
										'INNER JOIN app_employee_structure S ON S.employee_id=M.employee_id '+
										'LEFT JOIN app_job JOB ON JOB.job_id=S.job_id'
								},
								columns:[
									{ hidden:true,dataIndex: 'employee_id',database:{field:'M.employee_id'} },
									{ text: 'No. ID',width: 80, dataIndex: 'id_number' ,align:'center',database:{field:'id_number'} },
									{ text: 'Nama',width: 200,dataIndex: 'name',database:{field:"CONCAT(CASE WHEN first_name IS NULL THEN '' ELSE first_name END,' ',CASE WHEN last_name IS null THEN '' ELSE last_name END) AS name"} },
									{ text: 'Jenis Kelamin',width: 100,align:'center', dataIndex:'gender' ,database:{field:'GENDER.option_name AS gender'} },
									{ text: 'Tanggal Lahir',width: 100,align:'center', dataIndex: 'birth_date' ,database:{field:'birth_date'} },
									{ text: 'Pekerjaan',width: 100,dataIndex: 'job' ,database:{field:'JOB.job_name AS job'} },
									{ text: 'Alamat',width: 100,dataIndex: 'address',flex:1,database:{field:'address'}  },
								]
							}
						},{
							xtype:'itextarea',
							id : 'ORG_STRUCTURE.input.f3',
							submit:'ORG_STRUCTURE.input.panel',
							maxLength:256,
							fieldLabel: 'Deskripsi',
							name : 'f3',
						},{
							xtype:'icheckbox',
							name:'f4',
							fieldLabel:'Aktif',
							submit:'ORG_STRUCTURE.input.panel',
							id:'ORG_STRUCTURE.input.f4',
							checked:true
						}
					]
				}
			]
		},
		{xtype:'iconfirm',id : 'ORG_STRUCTURE.confirm'}
	]
});