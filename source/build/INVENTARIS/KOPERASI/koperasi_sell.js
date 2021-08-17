shortcut.set({
	code:'main',
	list:[
		{
			key:'f5',
			fn:function(){
				
			}
		},{
			key:'f9',
			fn:function(){
				_click('KOPERASI_SELL.btnNew');
			}
		},{
			key:'f8',
			fn:function(){
				Ext.getCmp('KOPERASI_SELL.main.f').focus();
			}
		},{
			key:'f10',
			fn:function(){
				_click('KOPERASI_SELL.btnPay');
			}
		}
	]
});
new Ext.Panel({
	id : 'KOPERASI_SELL.main',
	layout:'fit',
	border:false,
	tbar:[{xtype:'ibuttonnewtab'},{xtype:'ibuttonfullscreen'},{
		xtype:'iconfig',
		id:'KOPERASI_SELL.config',
		code:[
			iif(_access('KOPERASI_SELL_config_UNIT_ID')==false,'UNIT_ID',null),
			iif(_access('KOPERASI_SELL_config_DEFAULT_PAYMENT')==false,'DEFAULT_PAYMENT',null),
			iif(_access('KOPERASI_SELL_config_AUTO_PAYMENT')==false,'AUTO_PAYMENT',null),
			iif(_access('KOPERASI_SELL_config_AUTO_POSTING')==false,'AUTO_POSTING',null),
		]
	}],
	items : [
		{
			xtype:'ipanel',
			id : 'KOPERASI_SELL.panel',
			layout:{
				type:'vbox',
				align:'stretch'
			},
			fbar:[
				{
					xtype:'button',
					width:130,
					height: 45,
					handler:function(){
						_access('KOPERASI_SELL_new',function(){
							Ext.getCmp('KOPERASI_SELL.confirm').confirm({
								msg : "Transaksi Baru?",
								allow : 'KOPERASI_SELL.new',
								onY : function() {
									Ext.getCmp('KOPERASI_SELL.panel').getForm().reset(true);
									Ext.getCmp('KOPERASI_SELL.list').resetTable();
									Ext.getCmp('KOPERASI_SELL.panel').qSetForm();
									Ext.getCmp('KOPERASI_SELL.main.f').focus();
								}
							});
						});
					},
					id:'KOPERASI_SELL.btnNew',
					iconCls:'fa fa-file',
					style:'font-size: 30px;background-color:#ffffcc;',
					text:'<div style="font-size: 30px;text-align:right;">BARU</div>'
				},{
					xtype:'inumberfield',
					id : 'KOPERASI_SELL.total',
					// width: 170,
					fieldStyle:'font-size: 30px;text-align:right; background-color:rgb(185, 249, 102) !important',
					labelStyle:'font-weight: bold;',
					fieldLabel:'Total',
					height:45,
					readOnly:true,
					labelWidth: 50,
					tabIndex: -1,
					name : 'total',
					app:{type:'CURRENCY',decimal:2},
				},{
					xtype:'button',
					width:170,
					height: 45,
					id:'KOPERASI_SELL.btnPay',
					handler:function(){
						var req=Ext.getCmp('KOPERASI_SELL.panel').qGetForm(true);
						if(req == false){
							Ext.getCmp('KOPERASI_SELL.confirm').confirm({
								msg : 'Simpan Transaksi ini?',
								allow : 'KOPERASI_SELL.pay',
								onY : function() {
									var param = Ext.getCmp('KOPERASI_SELL.panel').qParams();
									Ext.Ajax.request({
										url : url + 'cmd?m=KOPERASI_SELL&f=pay',
										method : 'POST',
										params:param,
										before:function(){
											Ext.getCmp('KOPERASI_SELL.panel').setLoading('Menyimpan');
										},
										success : function(response) {
											Ext.getCmp('KOPERASI_SELL.panel').setLoading(false);
											var r = ajaxSuccess(response);
											if (r.r == 'S') {
												Ext.getCmp('KOPERASI_SELL.panel').getForm().reset(true);
												Ext.getCmp('KOPERASI_SELL.list').resetTable();
												Ext.getCmp('KOPERASI_SELL.panel').qSetForm();
												Ext.getCmp('KOPERASI_SELL.main.f').focus();
											}
										},
										failure : function(jqXHR, exception) {
											Ext.getCmp('KOPERASI_SELL.panel').setLoading(false);
											ajaxError(jqXHR, exception,true);
										}
									});
								}
							});
						}
					},
					iconCls:'fa fa-money',
					style:'font-size: 30px;background-color:#ffffcc;',
					text:'<div style="font-size: 30px;text-align:right;">SELESAI</div>'
				}
			],
			paddingBottom:false,
			items:[
				{
					xtype:'panel',
					border:false,
					layout:'column',
					style:'margin-bottom:4px;',
					items:[
						{
							xtype:'itextfield',
							name:'id_number',
							fieldLabel:'ID Number',
							id:'KOPERASI_SELL.main.f',
							labelAlign:'top',
							listeners: {
								'focus': function() {
									if(!this.tip){
										var tipCfg = {
											autoHide: false,
											anchor: 'left',
											style:' background-color:rgb(185, 249, 102);',
											target: 'KOPERASI_SELL.main.f',
											html:'<h3>Scan Name Tag Barcode Anda</h3>'
										};
										if (Ext.isString(this.qtip)) {
										} else {
											Ext.apply(tipCfg, this.qtip);
										}
										this.tip = new Ext.ToolTip(tipCfg);
									}
									this.tip.show();
								},
								blur: function(){
									if(this.tip){
										this.tip.destroy();
										delete this.tip;
									}
								},
								destroy: function(){
									if(this.tip){
										this.tip.destroy();
										delete this.tip;
									}
								}
							},
							press:{
								enter:function(a){
									if(a.getValue()!==''){
										Ext.Ajax.request({
											url : url + 'cmd?m=KOPERASI_SELL&f=getEmployeeByNumber',
											method : 'GET',
											params:{i:a.getValue()},
											success : function(response) {
												var r = ajaxSuccess(response);
												if (r.r == 'S') {
													var o=r.d;
													if(o!= undefined && o!=null){
														Ext.getCmp('KOPERASI_SELL.main.f1').setValue({employee_id:o.i,name:o.text});
														// var table=Ext.getCmp('KOPERASI_SELL.list');
														Ext.getCmp('KOPERASI_SELL.main.barcode').focus();
													}
												}
											},
											failure : function(jqXHR, exception) {
												ajaxError(jqXHR, exception,true);
											}
										});
									}
								}
							}
						},{
							xtype:'iselect',
							fieldLabel:'Karyawan',
							id:'KOPERASI_SELL.main.f1',
							allowBlank : false,
							labelAlign:'top',
							width: 250,
							valueField:'employee_id',
							textField:'name',
							name:'f1',
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
												Ext.getCmp('KOPERASI_SELL.main.f1').refresh();
											}
										},
										id:'KOPERASI_SELL.main.f1.f1'
									},{
										xtype:'ihiddenfield',
										name:'f6',
										database:{
											table:'app_employee',
											field:'M.tenant_id',
											type:'double',
											separator:'='
										},
										id:'KOPERASI_SELL.main.f1.f2',
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
												Ext.getCmp('KOPERASI_SELL.main.f1').refresh();
											}
										}
									},{
										xtype:'idropdown',
										name : 'f3',
										fieldLabel:'Jenis Kelamin',
										database:{
											table:'app_employee',
											field:'gender'
										},
										parameter:'GENDER',
										press:{
											enter:function(){
												Ext.getCmp('KOPERASI_SELL.main.f1').refresh();
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
														Ext.getCmp('KOPERASI_SELL.main.f1').refresh();
													}
												},
												emptyText:'Awal'
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
														Ext.getCmp('KOPERASI_SELL.main.f1').refresh();
													}
												},
												emptyText:'Akhir'
											}
										]
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
												Ext.getCmp('KOPERASI_SELL.main.f1').refresh();
											}
										}
									}
								],
								database:{
									table:'app_employee',
									inner:'INNER JOIN app_parameter_option GENDER ON GENDER.option_code=M.gender '
								},
								columns:[
									{ hidden:true,dataIndex: 'employee_id',database:{field:'employee_id'} },
									{ text: 'No. ID',width: 80, dataIndex: 'id_number' ,align:'center',database:{field:'id_number'} },
									{ text: 'Nama',width: 200,dataIndex: 'name',database:{field:"CONCAT(CASE WHEN first_name IS NULL THEN '' ELSE first_name END,' ',CASE WHEN last_name IS null THEN '' ELSE last_name END) AS name"} },
									{ text: 'Jenis Kelamin',width: 100,align:'center', dataIndex:'gender' ,database:{field:'GENDER.option_name AS gender'} },
									{ text: 'Tanggal Lahir',width: 100,align:'center', dataIndex: 'birth_date' ,database:{field:'birth_date'} },
									{ text: 'Alamat',width: 100,dataIndex: 'address',flex:1,database:{field:'address'}  },
								]
							}
						}
					]
				},{
					xtype:'ilistinput',
					id:'KOPERASI_SELL.list',
					flex:1,
					bodyStyle:'margin-left:-1px;',
					name:'options',
					margin:false,
					loading:false,
					countLine:function(line){
						var table=Ext.getCmp('KOPERASI_SELL.list');
						table._get('total',line)._setValue(table._get('jumlah',line)._getValue()*table._get('harga',line)._getValue());
						table.count();
					},
					count:function(){
						var table=Ext.getCmp('KOPERASI_SELL.list');
						var tot=0;
						for(var i=0,iLen=table._getTotal(); i<iLen;i++){
							tot+=table._get('total',i)._getValue();
						}
						Ext.getCmp('KOPERASI_SELL.total')._setValue(tot);
					},
					tbar:[
						{
							xtype:'itextfield',
							id:'KOPERASI_SELL.main.barcode',
							tabIndex:-1,
							text:'Barcode',
							fieldLabel:'Scan Barcode',
							width: 300,
							margin:false,
							property	:{
								space:false
							},
							listeners: {
								'focus': function() {
									if(!this.tip){
										var tipCfg = {
											autoHide: false,
											anchor: 'left',
											target: 'KOPERASI_SELL.main.barcode',
											style:' background-color:rgb(185, 249, 102);',
											html:'<h3>Scan Barcode Barang<br>[F10] Transaksi Selesai<br>[F9] Transaksi Baru</h3>'
										};
										if (Ext.isString(this.qtip)) {
										} else {
											Ext.apply(tipCfg, this.qtip);
										}
										this.tip = new Ext.ToolTip(tipCfg);
									}
									this.tip.show();
								},
								blur: function(){
									if(this.tip){
										this.tip.destroy();
										delete this.tip;
									}
								},
								destroy: function(){
									if(this.tip){
										this.tip.destroy();
										delete this.tip;
									}
								}
							},
							press:{
								enter:function(a){
									if(a.getValue()!==''){
										var val=a.getValue();
										a.setValue('');
										Ext.Ajax.request({
											url : url + 'cmd?m=KOPERASI_SELL&f=getItemByBarcode',
											method : 'GET',
											params:{i:val},
											success : function(response) {
												var r = ajaxSuccess(response);
												if (r.r == 'S') {
													var o=r.d;
													if(o!=null){
														var table=Ext.getCmp('KOPERASI_SELL.list');
														var line=table._getTotal()-1;
														var ada=false;
														for(var i=0,iLen=table._getTotal();i<iLen;i++){
															if(table._get('barang',i).getValue()==o.i){
																line=i;
																ada=true;
																break;
															}
														}
														if(ada==false){
															if(table._getTotal()>1 || 
															(table._getTotal()==1 && table._get('barang',line).getValue() !=null && table._getTotal()==1 && table._get('barang',table._getTotal()-1).getValue() !='')){
																table._add();
																line=table._getTotal()-1;
															}
														}
														table.loading=true;
														table._get('barang',line).setValue({i:o.i,name:o.NAME});
														table.loading=false;
														table._get('satuan',line).setValue(o.sat_s);
														table._get('measurement_id',line).setValue(o.sat_id);
														table._get('fraction',line).setValue(o.frac);
														table._get('barcode',line).setValue(o.barcode);
														if((table._get('jumlah',line)._getValue()+1)>o.stock){
															Ext.create('App.cmp.Toast').toast({msg : "Pembelian Barang '"+o.NAME+"' tidak boleh lebih dari "+o.stock,type : 'warning'});
														}else{
															table._get('jumlah',line)._setValue(table._get('jumlah',line)._getValue()+1);
														}
														table._get('harga',line)._setValue(o.harga);
														table._get('stok',line)._setValue(o.stock);
														a.setValue('');
														a.focus();
														table.countLine(line);
													}
												}
											},
											failure : function(jqXHR, exception) {
												ajaxError(jqXHR, exception,true);
											}
										});
									}
								}
							}
						}
					],
					items:[
						{
							xtype:'itextfield',
							name:'barcode',
							tabIndex:-1,
							text:'Barcode',
							emptyText:'Enter Barcode',
							allowBlank: true,
							hidden:true,
							width: 150,
							property	:{
								space:false
							},
							press:{
								enter:function(a){
									if(a.getValue()!==''){
										Ext.Ajax.request({
											url : url + 'cmd?m=KOPERASI_SELL&f=getItemByBarcode',
											method : 'GET',
											params:{i:a.getValue()},
											success : function(response) {
												var r = ajaxSuccess(response);
												if (r.r == 'S') {
													var o=r.d;
													if(o!=null){
														var table=Ext.getCmp('KOPERASI_SELL.list');
														table.loading=true;
														table._get('barang',a.line).setValue({i:o.i,name:o.NAME});
														table.loading=false;
														table._get('satuan',a.line).setValue(o.sat_s);
														table._get('measurement_id',a.line).setValue(o.sat_id);
														table._get('fraction',a.line).setValue(o.frac);
														table._get('harga',a.line)._setValue(o.harga);
														table._get('stok',a.line)._setValue(o.stock);
														table._get('barcode',line).setValue(o.barcode);
													}
												}
											},
											failure : function(jqXHR, exception) {
												ajaxError(jqXHR, exception,true);
											}
										});
									}
								}
							}
						},{
							xtype:'ihiddenfield',
							name:'measurement_id',
						},{
							xtype:'ihiddenfield',
							name:'fraction',
						},{
							xtype:'iselect',
							flex:1,
							text:'Barang',
							emptyText:'Barang',
							allowBlank : false,
							valueField:'i',
							textField:'name',
							name:'barang',
							onReset:function(a){
								// var table=Ext.getCmp('INV_SALES.input.tableOption');
								// table._getForm(a.line).getForm().reset(true);
								// table.countLine(a.line);
								// table.count();
							},
							onSelect:function(a,b){
								var table=Ext.getCmp('KOPERASI_SELL.list');
								if(table.loading==false){
									var line=b.line;
									var ada=false;
									for(var i=0,iLen=table._getTotal();i<iLen;i++){
										if(i!==b.line){
											if(table._get('barang',i).getValue()==a.i){
												console.log(a);
												line=i;
												ada=true;
												break;
											}
										}
									}
									console.log(ada);
									table._get('satuan',line).setValue(a.sat_s);
									table._get('measurement_id',line).setValue(a.sat_id);
									table._get('fraction',line).setValue(a.frac);
									table._get('barcode',line).setValue(a.barcode);
									table._get('harga',line)._setValue(a.harga);
									table._get('stok',line)._setValue(a.stock);
									if((table._get('jumlah',line)._getValue()+1)>a.stock){
										Ext.create('App.cmp.Toast').toast({msg : "Pembelian Barang '"+a.name+"' tidak boleh lebih dari "+a.stock,type : 'warning'});
									}else{
										table._get('jumlah',line)._setValue(table._get('jumlah',line)._getValue()+1);
									}
									if(ada==true){
										table._getForm(b.line).getForm().reset(true);
										Ext.getCmp('KOPERASI_SELL.main.barcode').focus();
										setTimeout(function(){table._remove(b.line);Ext.getCmp('KOPERASI_SELL.main.barcode').focus();table.countLine(line);},1000);
									}else{
										table.countLine(line);
									}
								}
							},
							button:{
								urlData : url + 'cmd?m=KOPERASI_SELL&f=getListItem',
								windowWidth: 800,
								items:[
									{
										xtype:'itextfield',
										name:'f2',
										fieldLabel:'Nama Barang',
									},{
										xtype:'ihiddenfield',
										name:'unit_id',
										id:'INV_SALES.input.item.unit_id',
									},{
										xtype:'ihiddenfield',
										name:'partners_id',
										id:'INV_SALES.input.item.partners_id',
									},{
										xtype:'itextfield',
										name:'f1',
										fieldLabel:'Kode Barang',
									},{
										xtype:'itextfield',
										name:'f3',
										fieldLabel:'Deskripsi',
									},{
										xtype:'itextfield',
										name:'f6',
										fieldLabel:'Gin Code',
									},{
										xtype:'itextfield',
										name:'f7',
										fieldLabel:'Bacth',
									},{
										xtype:'idropdown',
										fieldLabel:'Jenis Barang',
										parameter:'ITEM_TYPE',
										name : 'f4',
									},{
										xtype:'idropdown',
										parameter:'ACTIVE_FLAG',
										name : 'f5',
										width: 200,
										fieldLabel: 'Active'
									}
								],
								columns:[
									{ hidden:true,dataIndex: 'i'},
									{ hidden:true,dataIndex: 'frac'},
									{ hidden:true,dataIndex: 'sat_id'},
									{ hidden:true,dataIndex: 'sat_s'},
									{ hidden:true,dataIndex: 'barcode'},
									{ text: 'Barang',flex:1, dataIndex: 'name'},
									{ text: 'Stok',width: 100, dataIndex:'stock',align:'right',
										renderer: function(value,a){
											return Number(value).toLocaleString(window.navigator.language,{minimumFractionDigits:2 })+' '+a.record.raw.sat_s;
										}
									},{ text: 'Harga',width: 100, dataIndex:'harga',align:'right',
										renderer: function(value){
											return Number(value).toLocaleString(window.navigator.language,{style: 'currency', currency: 'IDR',minimumFractionDigits:2 });;
										}
									},{ text: 'Aktif',width: 50,sortable :false,dataIndex: 'a',align:'center',
										renderer: function(value){
											if(value==true)
												return '<span class="fa fa-check"></span>';
											return '<span class="fa fa-close"></span>';
										}
									}
								]
							}
						},{
							xtype:'inumberfield',
							name:'stok',
							align:'right',
							text:'Stok',
							value:0,
							readOnly:true,
							// app:{decimal:0},
							width: 80,
						},{
							xtype:'itextfield',
							name:'satuan',
							text:'Satuan',
							tabIndex:-1,
							readOnly:true,
							emptyText:'Satuan',
							width: 100
						},{
							xtype:'inumberfield',
							name:'jumlah',
							align:'right',
							text:'Jumlah',
							value:0,
							allowBlank: false,
							app:{decimal:0},
							width: 100,
							listeners:{
								blur:function(a){
									var table=Ext.getCmp('KOPERASI_SELL.list');
									var val =a._getValue();
									if(table._get('stok',a.line)._getValue()<val){
										Ext.create('App.cmp.Toast').toast({msg : "Jumlah tidak boleh lebih dari "+table._get('stok',a.line)._getValue(),type : 'warning'});
										a._setValue(table._get('stok',a.line)._getValue());
									}
									table.countLine(a.line);
								}
							}
						},{
							xtype:'inumberfield',
							name:'harga',
							tabIndex:-1,
							align:'right',
							text:'Harga',
							readOnly:true,
							value:0,
							app:{type:'CURRENCY',decimal:2},
							width: 150,
						},{
							xtype:'inumberfield',
							name:'total',
							readOnly:true,
							tabIndex:-1,
							align:'right',
							text:'Total',
							value:0,
							app:{type:'CURRENCY',decimal:2},
							width: 150,
							fieldStyle:'text-align:right; background-color:rgb(185, 249, 102) !important',
						}
					]
				}
			]
		},{xtype:'iconfirm',id : 'KOPERASI_SELL.confirm'}
	]
})