Ext.define('App.cmp.Window', {
	extend : 'Ext.window.Window',
	glyph:'',
	iconCls:'fa fa-desktop',
	constrain : true,
	closeAction : 'hide',
	autoScroll: true,
	resizable : false,
	bodyStyle:'padding-right: -1px;',
	modal : true,
	closing : true,
	q : {type : 'window'},
	full:false,
	layout : 'fit',
	initComponent:function(a){
		var $this=this;
		var listShowOri=null;
		if(this.listeners != undefined && this.listeners.show != undefined){listShowOri=this.listeners.show;}
		if(this.listeners==undefined){this.listeners={};}
		this.listeners.show=function(a) {
			if(listShowOri!=null){listShowOri(a);}
			if (a.qShow != undefined){a.qShow();}
			var size = {
				width: window.innerWidth || document.body.clientWidth,
				height: window.innerHeight || document.body.clientHeight
			}
			if($this.maximized == undefined || $this.maximized==false){
				if(_single_page==false){
					if(Ext.getCmp('west-region-container') != undefined && Ext.getCmp('west-region-container').collapsed===false){$this.maxWidth=size.width-200;}else{$this.maxWidth=size.width-32;}
				}
				if(_single_page==false){
					$this.maxHeight=size.height-100;
					if(Ext.getCmp('header').hidden===true){$this.maxHeight=size.height-30;}
					if(_mobile==true){
						$this.maxHeight=size.height-43;
						$this.maxWidth=size.width-2;
					}
				}
			}
			$('#'+$this.el.id.replace('.','\\.')+'_header-iconEl').replaceWith('<div class="'+$('#'+$this.el.id.replace('.','\\.')+'_header-iconEl').attr('class')+'" id="'+$this.el.id+'_header-iconEl'+'"></div>');
			$this.center();			
		};
		this.listeners.close = function(a) {if (a.qHide != undefined){a.qHide();}};
		this.listeners.beforeclose ={
			fn : function(t) {
				var close = true;
				if (t.qBeforeClose != undefined && t.closing == false){close = t.qBeforeClose();}
				if (close == true && t.closing == true){return true;}else{return false;}
			}
		};
		this.callParent(arguments);
		var size = {
			width: window.innerWidth || document.body.clientWidth,
			height: window.innerHeight || document.body.clientHeight
		}
		if(_mobile==true){
			$this.maxHeight=size.height-30;
			$this.maxWidth=size.width-2;
		}
	},
	qClose : function() {
		this.closing = true;
		this.close();
	}
});