import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import { AppRegistry } from '@webrcade/app-common';
import { enableDropHandler } from '../../UrlProcessor';
import { usePrevious } from '../../Util';
import Stack from '@mui/material/Stack';
import Prefs from '../../Prefs';

const CATEGORIES = [
  { id: 'atari', label: 'Atari' },
  { id: 'nintendo', label: 'Nintendo' },
  { id: 'sega', label: 'Sega' },
  { id: 'nec', label: 'NEC' },
  { id: 'sony', label: 'Sony' },
  { id: 'snk', label: 'SNK' },
  { id: 'arcade', label: 'Arcade' },
  { id: 'computers', label: 'Computers' },
  { id: 'other', label: 'Other' }
];

const BASE_FEED_URL = 'https://webrcade.github.io/webrcade-default-feed/images/';
const PLATFORM_THUMB_EXCEPTIONS = {
  'arcade':        'arcade-thum.png',   // typo in live URL; fix when default-feed is pushed
  'commodore-c64': 'c64-thumb.png',
  'gg':            'gamegear-thumb.png',
  'lnx':           'lynx-thumb.png',
  'sms':           'mastersystem-thumb.png',
  'scumm':         'scummvm-thumb.png',
};
const getPlatformThumb = (key) =>
  BASE_FEED_URL + (PLATFORM_THUMB_EXCEPTIONS[key] || `${key}-thumb.png`);

const getManufacturerFromName = (name) => {
  const nameLower = name.toLowerCase();
  if (nameLower.includes('sega')) return 'sega';
  if (nameLower.includes('nintendo')) return 'nintendo';
  if (nameLower.includes('snk') || nameLower.includes('neo geo')) return 'snk';
  if (nameLower.includes('atari')) return 'atari';
  if (nameLower.includes('nec')) return 'nec';
  if (nameLower.includes('sony') || nameLower.includes('playstation')) return 'sony';
  if (nameLower.includes('apple') || nameLower.includes('commodore') ||
      nameLower.includes('amiga') || nameLower.includes('dos') ||
      nameLower.includes('pc ') || nameLower.includes('computer')) return 'computers';
  if (nameLower.includes('arcade') || nameLower.includes('capcom') ||
      nameLower.includes('konami')) return 'arcade';
  return 'other';
};

const prepareData = (feedOverrides) => {
  const types = AppRegistry.instance.getAppTypes();
  const aliasMap = {};
  const specificList = [];

  for (const key in types) {
    const type = types[key];
    const isAlias = type.absoluteKey !== undefined;
    const name = AppRegistry.instance.getShortNameForType(key);
    const manufacturer = getManufacturerFromName(name);

    if (isAlias) {
      const aliasKey = type.alias || key;
      const aliasThumbnail = getPlatformThumb(key);
      if (!aliasMap[manufacturer]) aliasMap[manufacturer] = [];
      aliasMap[manufacturer].push({ key, name, thumbnail: aliasThumbnail, manufacturer, aliasKey });
    } else {
      const aliasKey = type.alias;
      const parentAlias = aliasKey ? types[aliasKey] : null;
      const parentAliasName = parentAlias ? AppRegistry.instance.getShortNameForType(aliasKey) : '';
      const coreName = type.coreName || '';
      const feedDefault = aliasKey && feedOverrides[aliasKey] === key;
      const globalDefault = aliasKey && types[aliasKey]?.absoluteKey === key;

      const specificThumbnail = getPlatformThumb(aliasKey);
      specificList.push({
        key, name, thumbnail: specificThumbnail, manufacturer, aliasKey,
        parentAliasName, coreName, isFeedDefault: feedDefault, isGlobalDefault: globalDefault
      });
    }
  }

  Object.keys(aliasMap).forEach(manufacturer => {
    aliasMap[manufacturer].sort((a, b) => a.name.localeCompare(b.name));
  });

  specificList.sort((a, b) => {
    const mfgCompare = a.manufacturer.localeCompare(b.manufacturer);
    if (mfgCompare !== 0) return mfgCompare;
    const aliasCompare = (a.parentAliasName || '').localeCompare(b.parentAliasName || '');
    if (aliasCompare !== 0) return aliasCompare;
    return a.name.localeCompare(b.name);
  });

  return { aliasMap, specificList };
};

const filterData = (data, searchQuery) => {
  if (!searchQuery || searchQuery.length < 2) return data;
  const query = searchQuery.toLowerCase();
  const { aliasMap, specificList } = data;

  const filteredAliasMap = {};
  Object.keys(aliasMap).forEach(manufacturer => {
    const filtered = aliasMap[manufacturer].filter(item =>
      item.name.toLowerCase().includes(query)
    );
    if (filtered.length > 0) filteredAliasMap[manufacturer] = filtered;
  });

  const filteredSpecificList = specificList.filter(item =>
    item.name.toLowerCase().includes(query) ||
    (item.coreName && item.coreName.toLowerCase().includes(query)) ||
    (item.parentAliasName && item.parentAliasName.toLowerCase().includes(query))
  );

  return { aliasMap: filteredAliasMap, specificList: filteredSpecificList };
};

const ThumbnailImage = ({ src, alt }) => (
  <Box sx={{
    height: 100,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    p: 2
  }}>
    <Box
      component="img"
      src={src}
      alt={alt}
      sx={{ maxWidth: '100%', height: '150%', objectFit: 'contain' }}
    />
  </Box>
);

const PlatformCard = ({ item, section, selectedItem, selectedSection, onSelect }) => {
  const isSelected = selectedItem?.key === item.key && selectedSection === section;

  return (
    <Box
      onClick={() => onSelect(item, section)}
      sx={{
        bgcolor: isSelected ? 'action.selected' : 'rgba(0,0,0,0.15)',
        border: isSelected ? '2px solid' : '1px solid',
        borderColor: isSelected ? 'primary.main' : 'divider',
        borderRadius: 2,
        cursor: 'pointer',
        overflow: 'hidden',
        '&:hover': { bgcolor: 'action.hover' }
      }}
    >
      {item.thumbnail && <ThumbnailImage src={item.thumbnail} alt={item.name} />}
      <Box sx={{ p: 1.5, pt: 1, textAlign: 'center' }}>
        {item.isSpecificCore && item.parentAliasName ? (
          <>
            <Typography variant="body2" sx={{ fontSize: '0.875rem', lineHeight: 1.3 }}>
              {item.parentAliasName}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: '0.75rem', color: 'text.secondary', lineHeight: 1.2 }}>
              {item.name}
            </Typography>
          </>
        ) : (
          <Typography variant="body2" sx={{ fontSize: '0.875rem', lineHeight: 1.3 }}>
            {item.name}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

const CardGrid = ({ children }) => (
  <Box sx={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
    gap: 2
  }}>
    {children}
  </Box>
);

const NoResultsMessage = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
    <Typography variant="body1" color="text.secondary">
      No results found
    </Typography>
  </Box>
);

const CategorySidebar = ({ categories, activeCategory, onCategoryClick }) => (
  <Box sx={{
    width: 160,
    flexShrink: 0,
    borderRight: 1,
    borderColor: 'divider',
    bgcolor: 'rgba(0,0,0,0.08)',
    overflow: 'auto',
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-track': {
      bgcolor: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      bgcolor: 'rgba(0,0,0,0.3)',
      borderRadius: '4px',
      '&:hover': {
        bgcolor: 'rgba(0,0,0,0.4)',
      }
    },
    scrollbarWidth: 'thin',
    scrollbarColor: 'rgba(0,0,0,0.3) transparent'
  }}>
    <List dense>
      {categories.map(category => (
        <ListItem key={category.id} disablePadding>
          <ListItemButton
            selected={activeCategory === category.id}
            onClick={() => onCategoryClick(category.id)}
            sx={{
              py: 1.25,
              borderLeft: 3,
              borderColor: activeCategory === category.id ? 'primary.main' : 'transparent',
            }}
          >
            <ListItemText
              primary={category.label}
              primaryTypographyProps={{
                sx: {
                  fontSize: '0.875rem',
                  color: activeCategory === category.id ? 'text.primary' : 'text.secondary',
                  fontWeight: activeCategory === category.id ? 600 : 400,
                }
              }}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  </Box>
);

export default function PlatformChooserModal(props) {
  const { isOpen, setOpen, onSelect, feedOverrides = {} } = props;
  const [tabValue, setTabValue] = React.useState(0);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [selectedSection, setSelectedSection] = React.useState(null);
  const [activeCategory, setActiveCategory] = React.useState('atari');
  const [data] = React.useState(() => prepareData(feedOverrides));
  const contentRef = React.useRef(null);

  const prevOpen = usePrevious(isOpen);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const filteredData = React.useMemo(() =>
    filterData(data, searchQuery), [data, searchQuery]
  );

  if (prevOpen && !isOpen) {
    enableDropHandler(true);
  } else if (!prevOpen && isOpen) {
    enableDropHandler(false);
  }

  React.useEffect(() => {
    if (isOpen && !prevOpen) {
      setTabValue(0);
      setSearchQuery('');
      setSelectedItem(null);
      setSelectedSection(null);
      setActiveCategory('atari');
    }
  }, [isOpen, prevOpen]);

  const handleOk = () => {
    if (selectedItem && onSelect) {
      onSelect(selectedItem.key);
      Prefs.setRecentTypes(selectedItem.key);
    }
    setOpen(false);
  };

  const handleItemSelect = (item, section) => {
    setSelectedItem(item);
    setSelectedSection(section);
  };

  const scrollToCategory = (categoryId) => {
    setActiveCategory(categoryId);
    const element = document.getElementById(`category-${categoryId}`);
    if (element && contentRef.current) {
      const container = contentRef.current;
      const elementTop = element.offsetTop - container.offsetTop;
      container.scrollTo({ top: elementTop - 20, behavior: 'smooth' });
    }
  };

  const handleScroll = React.useCallback(() => {
    if (!contentRef.current) return;
    const container = contentRef.current;
    const scrollTop = container.scrollTop;
    for (let i = CATEGORIES.length - 1; i >= 0; i--) {
      const category = CATEGORIES[i];
      const element = document.getElementById(`category-${category.id}`);
      if (element) {
        const elementTop = element.offsetTop - container.offsetTop;
        if (scrollTop >= elementTop - 100) {
          setActiveCategory(category.id);
          break;
        }
      }
    }
  }, []);

  React.useEffect(() => {
    const container = contentRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  const renderAliasTab = () => {
    const { aliasMap, specificList } = filteredData;
    const hasSearch = searchQuery.length >= 2;

    const orderedCategories = CATEGORIES.filter(cat => aliasMap[cat.id]?.length > 0);

    const recentTypes = Prefs.getRecentTypes();
    const recentItems = hasSearch ? [] : recentTypes
      .map(key => {
        // First check aliases
        for (const cat in aliasMap) {
          const found = aliasMap[cat].find(item => item.key === key);
          if (found) return found;
        }
        // Then check specifics - show them with parent alias thumbnail but specific's name
        const specific = specificList.find(item => item.key === key);
        if (specific && specific.aliasKey) {
          for (const cat in aliasMap) {
            const aliasItem = aliasMap[cat].find(item => item.key === specific.aliasKey);
            if (aliasItem) {
              // Create a display item: alias thumbnail + specific name + specific key + parent alias name
              return {
                key: specific.key,
                name: specific.coreName || specific.name,
                thumbnail: aliasItem.thumbnail,
                manufacturer: specific.manufacturer,
                aliasKey: specific.aliasKey,
                parentAliasName: aliasItem.name,
                isSpecificCore: true
              };
            }
          }
        }
        return null;
      })
      .filter(Boolean);

    return (
      <Box sx={{ display: 'flex', height: '100%' }}>
        {isDesktop && !hasSearch && (
          <CategorySidebar
            categories={orderedCategories}
            activeCategory={activeCategory}
            onCategoryClick={scrollToCategory}
          />
        )}
        <Box sx={{ flex: 1, overflow: 'auto', p: 3, bgcolor: 'rgba(0,0,0,0.15)' }} ref={contentRef}>
          {hasSearch && orderedCategories.length === 0 && <NoResultsMessage />}
          {recentItems.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'text.primary' }}>
                Recent
              </Typography>
              <CardGrid>
                {recentItems.map(item => (
                  <PlatformCard
                    key={item.key}
                    item={item}
                    section="recent"
                    selectedItem={selectedItem}
                    selectedSection={selectedSection}
                    onSelect={handleItemSelect}
                  />
                ))}
              </CardGrid>
            </Box>
          )}
          {orderedCategories.map(category => (
            <Box key={category.id} id={`category-${category.id}`} sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'text.primary' }}>
                {category.label}
              </Typography>
              <CardGrid>
                {aliasMap[category.id].map(item => (
                  <PlatformCard
                    key={item.key}
                    item={item}
                    section={category.id}
                    selectedItem={selectedItem}
                    selectedSection={selectedSection}
                    onSelect={handleItemSelect}
                  />
                ))}
              </CardGrid>
            </Box>
          ))}
        </Box>
      </Box>
    );
  };

  const renderSpecificTab = () => {
    const { specificList } = filteredData;
    const hasSearch = searchQuery.length >= 2;
    const visibleCategories = CATEGORIES.filter(cat =>
      specificList.some(item => item.manufacturer === cat.id)
    );
    let currentManufacturer = null;
    let currentAlias = null;

    return (
      <Box sx={{ display: 'flex', height: '100%' }}>
        {isDesktop && !hasSearch && (
          <CategorySidebar
            categories={visibleCategories}
            activeCategory={activeCategory}
            onCategoryClick={scrollToCategory}
          />
        )}
        <Box sx={{ flex: 1, overflow: 'auto', bgcolor: 'rgba(0,0,0,0.15)' }} ref={contentRef}>
          {hasSearch && specificList.length === 0 && <NoResultsMessage />}
          <List sx={{ p: 0 }}>
            {specificList.map((item) => {
              const showManufacturerHeader = item.manufacturer !== currentManufacturer;
              const showAliasHeader = item.aliasKey !== currentAlias || showManufacturerHeader;

              if (showManufacturerHeader) {
                currentManufacturer = item.manufacturer;
                currentAlias = null;
              }
              if (showAliasHeader) currentAlias = item.aliasKey;

              const isSelected = selectedItem?.key === item.key;

              return (
                <React.Fragment key={item.key}>
                  {showManufacturerHeader && (
                    <ListItem
                      id={`category-${item.manufacturer}`}
                      sx={{
                        bgcolor: 'action.hover',
                        py: 1,
                        borderTop: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                        {CATEGORIES.find(c => c.id === item.manufacturer)?.label || 'Other'}
                      </Typography>
                    </ListItem>
                  )}
                  {showAliasHeader && item.parentAliasName && (
                    <ListItem
                      sx={{
                        py: 0.75,
                        pl: 2,
                        bgcolor: 'action.selected',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Typography sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        fontSize: '0.8rem'
                      }}>
                        {item.parentAliasName}
                      </Typography>
                    </ListItem>
                  )}
                  <ListItem disablePadding>
                    <ListItemButton
                      selected={isSelected}
                      onClick={() => handleItemSelect(item, 'specific')}
                      sx={{
                        pl: 3,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      {item.thumbnail && (
                        <Box sx={{
                          width: 64,
                          height: 56,
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2,
                          p: 0.75,
                          flexShrink: 0,
                        }}>
                          <Box
                            component="img"
                            src={item.thumbnail}
                            alt={item.name}
                            sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 1 }}
                          />
                        </Box>
                      )}
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" sx={{
                              color: 'text.primary',
                              fontWeight: 500,
                            }}>
                              {item.coreName}
                            </Typography>
                            {(item.isFeedDefault || item.isGlobalDefault) && (
                              <Typography variant="caption" sx={{
                                px: 0.75, py: 0.25,
                                bgcolor: item.isFeedDefault ? 'primary.main' : 'action.selected',
                                color: item.isFeedDefault ? 'primary.contrastText' : 'text.secondary',
                                borderRadius: 3,
                                fontSize: '0.7rem',
                                lineHeight: 1.3,
                              }}>
                                {item.isFeedDefault ? 'feed default' : 'default'}
                              </Typography>
                            )}
                          </Box>
                        }
                        secondary={item.parentAliasName}
                        secondaryTypographyProps={{
                          sx: { color: 'text.disabled', fontSize: '0.75rem' }
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                </React.Fragment>
              );
            })}
          </List>
        </Box>
      </Box>
    );
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={isOpen}
      onClose={() => setOpen(false)}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          height: fullScreen ? '100%' : '80vh',
          maxHeight: fullScreen ? '100%' : '80vh'
        }
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>Select Application</DialogTitle>
      <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Box sx={{ px: 3, pt: 1, pb: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Box>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
          <Tabs value={tabValue} onChange={(e, value) => setTabValue(value)}>
            <Tab label="General" />
            <Tab label="Specific" />
          </Tabs>
        </Box>
        <Box sx={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          {tabValue === 0 && renderAliasTab()}
          {tabValue === 1 && renderSpecificTab()}
        </Box>
      </DialogContent>
      <DialogActions sx={{ borderTop: 1, borderColor: 'divider', justifyContent: 'space-between', px: 3 }}>
        <Box sx={{ flex: 1 }}>
          {selectedItem && (
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                Selected:
              </Typography>
              <Box
                component="img"
                src={selectedItem.thumbnail}
                alt={selectedItem.name}
                sx={{ width: 32, height: 24, objectFit: 'contain', borderRadius: 1 }}
              />
              <Typography variant="body2" color="text.secondary">
                {selectedItem.isSpecificCore && selectedItem.parentAliasName
                  ? `${selectedItem.parentAliasName} (${selectedItem.name})`
                  : selectedItem.name}
              </Typography>
            </Stack>
          )}
        </Box>
        <Box>
          <Button onClick={handleOk} disabled={!selectedItem}>OK</Button>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
