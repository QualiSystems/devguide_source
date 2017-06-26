function versionChange()	 {
	var targetVersion = document.getElementById("version").value;
	if (targetVersion == "7.1.0")
	{
		window.location = "https://qualisystems.github.io/devguide_7/";
	}	
	else
	{
		var currentVersion = window.location.href.match(/\d\.\d\.\d/i)[0];
		document.getElementById("version").value = targetVersion
		window.location.href = window.location.href.replace(currentVersion,targetVersion);
	}
};