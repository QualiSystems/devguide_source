module MatchRegex
  def match_regex(text, regex)
    text.to_s[Regexp.new(regex), 1]
  end
end

Liquid::Template.register_filter(MatchRegex)