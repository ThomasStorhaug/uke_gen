from django import template

register = template.Library()

@register.filter(name="repeat")
def repeat(rounds):
    return range(rounds)

@register.filter(name="range")
def templ_range(start, end):
    return range(start, end)
