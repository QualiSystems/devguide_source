module Jekyll
  module VersionFilter
    def filterVersionDocument(collection, current_page_url)
      reg_str = '\d{1,4}\.\d\.\d'
      new_collection = []
      current_version = current_page_url.match(reg_str)
      collection.each do |i|
	  	if (i.url.include? current_version[0])
	  		new_collection.push(i)
	  	end
	  end
      return new_collection
    end
  end
end

Liquid::Template.register_filter(Jekyll::VersionFilter)