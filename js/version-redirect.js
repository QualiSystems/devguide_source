function versionChange()	 {
	var targetVersion = document.getElementById("version").value;
	var currentVersion = window.location.href.match(/\d{1,4}\.\d\.\d/i)[0];
	document.getElementById("version").value = targetVersion
	window.location.href = window.location.href.replace(currentVersion,targetVersion);
};