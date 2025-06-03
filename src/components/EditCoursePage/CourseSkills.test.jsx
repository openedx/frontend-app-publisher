import React from 'react';
import { render, screen } from '@testing-library/react';
import CourseSkills from './CourseSkills';
import '@testing-library/jest-dom';

describe('CourseSkills', () => {
  it('renders skill badges when skills are provided', () => {
    const skills = ['React', 'Node.js', 'GraphQL'];
    render(
      <CourseSkills
        className="test-badge"
        id="skills-section"
        input={{ name: 'skill_names', value: skills }}
        label="Skills"
      />
    );

    expect(screen.getByText('Skills')).toBeInTheDocument();


    skills.forEach(skill => {
      const badge = screen.getByText(skill);
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('test-badge');
    });
  });

  it('renders nothing if no skills are provided', () => {
    render(
      <CourseSkills
        className="test-badge"
        id="skills-section"
        input={{ name: 'skill_names', value: [] }}
        label="Skills"
      />
    );

    expect(screen.getByText('Skills')).toBeInTheDocument();
    expect(screen.queryByRole('badge')).not.toBeInTheDocument();
  });

  it('gracefully handles undefined input value', () => {
    render(
      <CourseSkills
        className="test-badge"
        id="skills-section"
        input={{ name: 'skill_names' }} // no value
        label="Skills"
      />
    );

    expect(screen.getByText('Skills')).toBeInTheDocument();
    expect(screen.queryByText('React')).not.toBeInTheDocument();
  });

  it('renders label as a React element', () => {
    const customLabel = <strong>Custom Skills Label</strong>;

    render(
      <CourseSkills
        className="test-badge"
        id="skills-section"
        input={{ name: 'skill_names', value: ['React'] }}
        label={customLabel}
      />
    );

    expect(screen.getByText('Custom Skills Label')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
  });
});
