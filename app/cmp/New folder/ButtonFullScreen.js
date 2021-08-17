Ext.define('App.cmp.ButtonFullScreen', {
	extend : 'Ext.Button',
	tooltip:'Full Screen/Not Full Screen <b>[F11]</b>',
	iconCls:'fa-window-maximize',
	allow:false,
	disabled:true,
	handler:function(a){
		var elem=document.body;
		if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
			if (elem.requestFullScreen) {elem.requestFullScreen();
			} else if (elem.mozRequestFullScreen) {elem.mozRequestFullScreen();
			} else if (elem.webkitRequestFullScreen) {elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
			} else if (elem.msRequestFullscreen) {elem.msRequestFullscreen();}
			a.setIconCls('fa fa-window-minimize');
		} else {
			if (document.cancelFullScreen) {document.cancelFullScreen();
			} else if (document.mozCancelFullScreen) {ument.mozCancelFullScreen();
			} else if (document.webkitCancelFullScreen) {document.webkitCancelFullScreen();
			} else if (document.msExitFullscreen) {document.msExitFullscreen();}
			a.setIconCls('fa fa-window-maximize');
		}
	},
	initComponent:function(a){
		if(_single_page==true || this.allow==true){this.disabled=false;}
		this.callParent();
		if(_mobile==true){this.hide();}
		if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
			this.setIconCls('fa fa-window-maximize');
		}else{this.setIconCls('fa fa-window-minimize');}
	}
})