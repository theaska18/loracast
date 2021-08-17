Ext.define('App.cmp.Confirm', {
	extend : 'Ext.window.Window',msg : '',title :'Konfirmasi',constrain : true,bodyStyle : 'background:transparent;',q : {type : 'confirm'},modal : true,als : '',
	closeAction : 'hide',resizable : false,minWidth : 200,maxWidth : 350,autoWidth : true,border : false,allow : [],
	confirm : function(dat) {
		var item=this.items.items[1],datAllow=this.allow[dat.allow];
		item.setValue(false);
		item.hide();
		this.als = '';
		if (dat.msg != undefined){this.items.items[0].items.items[1].setValue(dat.msg);}
		if (dat.onY != undefined){this.onY = dat.onY;}
		if (dat.onN != undefined){this.onN = dat.onN;}
		if (dat.allow != undefined) {
			if (datAllow == undefined){datAllow = false;}
			if (datAllow == false) {
				this.als = dat.allow;
				item.show();
				this.show();
			}else{if(this.onY != undefined){this.close();this.onY();}}
		}else{this.show();}
	},
	listeners : {show : function(a) {a.center();Ext.getCmp(a.id+'btnYes').focus();}},
	initComponent : function() {
		var $this = this;
		$this.items = [
			{
				xtype:'panel',
				bodyStyle : 'background:transparent;',border:false,
				layout : {type : 'hbox',align : 'stretch'},
				items : [
					{ html:'<div class="fa" style="font-family:FontAwesome;font-size:50px !important;">&#xf059;</div>&nbsp;',cls:'i-transparent',border:false
					}, {xtype : 'displayfield',style : 'margin-top:10px;margin-right:10px;',maxWidth : 280,value : $this.msg}
				]
			}, {xtype:'checkbox',style : 'margin-left: 10px;',boxLabel : 'do not ask again.'}
		];
		$this.fbar = [
			{
				xtype:'button',
				id:$this.id+'btnYes',
				text : 'Yes',
				iconCls : 'fa fa-check',
				handler : function() {
					$this.close();
					if ($this.als != '' && $this.items.items[1].getValue() == true){$this.allow[$this.als] = true;}
					if ($this.onY != undefined){$this.onY();}
				}
			},{
				xtype:'button',
				text : 'No',
				iconCls : 'fa fa-close',
				handler : function() {$this.close();if ($this.onN != undefined){$this.onN();}}
			}
		];
		$this.callParent(arguments);
	}
});