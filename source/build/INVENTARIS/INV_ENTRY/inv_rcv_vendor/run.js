if(_access('INV_RCV_VENDOR_notification')==true){
	notification=false;
}
var home=Ext.getCmp('main.tab.home');
if(_show_home==true){
	home.add({
		xtype:'panel',
		minWidth: 340,
		margin:true,
		columnWidth:iif(_mobile==true,1,.33),
		height:300,
		layout: 'fit',
		tbar: [{
			iconCls:'fa fa-save',
			handler: function() {
				Ext.MessageBox.confirm('Confirm Download', 'Apakah Akan Simpan Gambar ini?', function(choice){
					if(choice == 'yes'){
						Ext.getCmp('INV_RCV_VENDOR.home.1').save({
							type: 'image/png'
						});
					}
				});
			}
		}, {
			iconCls:'fa fa-refresh',
			handler: function() {
				Ext.getCmp('INV_RCV_VENDOR.home.1').generateData();
			}
		}],
		items:{
			id: 'INV_RCV_VENDOR.home.1',
			xtype: 'chart',
			animate: true,
			store: Ext.create('Ext.data.ArrayStore', {
				fields: [{name: 'name'},{name: 'data',   type: 'float'}],
				data: []
			}),
			generateData:function(){
				Ext.getCmp('INV_RCV_VENDOR.home.1').getStore().loadData([]);
				Ext.Ajax.request({
					url : url + 'cmd?m=INV_RCV_VENDOR&f=initRun',
					method : 'GET',
					success : function(response) {
						var r = ajaxSuccess(response);
						if (r.r == 'S') {
							var o=r.d;
							var o1=r.d.l1;
							
							var li=[];
							for(var i=0,iLen=o1.length; i<iLen;i++){
								var obj=o1[i];
								lio=[];
								lio.push(obj.f1);
								lio.push(obj.f2);
								li.push(lio);
							}
							Ext.getCmp('INV_RCV_VENDOR.home.1').getStore().loadData(li);
						}
					},
					failure : function(jqXHR, exception) {
						ajaxError(jqXHR, exception,true);
					}
				});
			},
			axes: [{
				type: 'Numeric',
				position: 'left',
				fields: ['data'],
				label: {
					renderer: Ext.util.Format.numberRenderer('0,0')
				},
				title: 'Jumlah Transaksi',
				grid: true,
				minimum: 0,
			}, {
				type: 'Category',
				position: 'bottom',
				fields: ['name'],
				grid: true,
				title: 'Penerimaan Barang',
				label: {
					renderer: function(v) {
						return Ext.String.ellipsis(v, 15, false);
					},
					font: '9px Arial',
					rotate: {
						degrees: 270
					}
				}
			}],
			series: [{
				type: 'column',
				axis: 'left',
				// highlight: true,
				tips: {
				  trackMouse: false,
				  width: 140,
				  height: 28,
				  renderer: function(storeItem, item) {
						this.setTitle(storeItem.get('name') + ': ' + storeItem.get('data') + ' Penerimaan');
				  }
				},
				label: {
					display: 'insideEnd',
					field: 'data',
					renderer: Ext.util.Format.numberRenderer('0'),
					orientation: 'vertical',
					color: '#333',
					'text-anchor': 'middle'
				},
				xField: 'name',
				yField: 'data'
			}]
		}
	});
	setInterval(function(){
		Ext.getCmp('INV_RCV_VENDOR.home.1').generateData();
	},900000);
	Ext.getCmp('INV_RCV_VENDOR.home.1').generateData();
}