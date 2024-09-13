import geopandas
import matplotlib.pyplot as plt

state = geopandas.read_file('/Users/zhibinwang/Documents/CSE/CSE416/Eco-Analyzer/tl_2020_36_vtd20/tl_2020_36_vtd20.shp')
state.plot()
plt.show()